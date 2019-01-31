// gcunit.route.js

const express = require('express');
const multer = require('multer');
const app = express();
const mongoose = require('mongoose');
const gcUnitRoutes = express.Router();
const csv = require('fast-csv');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database.js');
const fs = require('fs');
// Require model in our routes module
var Editor = require('../models/editor.js');
var Bookcode = require('../models/bookcode.js');
var Contract = require('../models/contractdb.js');
var Paylist = require('../models/paylistdb.js');
var Payday = require('../models/payday.js');
var Royalti = require('../models/royalti.js');
bnpanal = require('../services/services.js').bnpanal;
halfofyear = require('../services/services.js').halfofyear;
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb){
      cb(null, 'uploads/');
    },
    filename(req,file,cb){
      cb(null,file.originalname);
    }
  })
})

// Defined store route
gcUnitRoutes.get('/', function(req,res,next){
  res.render('../src/index.html');
});

// loginparts**************************************************
/*gcUnitRoutes.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!'
      });
    });
  })(req, res, next);
});*/

gcUnitRoutes.post('/login', function(req, res) {
  
  Editor.findOne({
    저자: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          var payload = {
            name : user.저자,
            email : user.이메일
          }
          // if user is found and password is right create a token
          var token = jwt.sign(user.toJSON(), config.secret, { expiresIn: '30m'});
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});
gcUnitRoutes.get('/auth', passport.authenticate('jwt', {session : false}), function(req,res){
  let token = getToken(req.headers);// req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];
  
  //decode token
  if(token){
    jwt.verify(token, config.secret,function(err, decoded) {
      if(err){
        return res.json({ success: false, message: 'Failed to authenticate token.'});
      }else{
        return res.json(decoded)
      }
    });
  }else{
    return res.status(403).send({success: false, message: 'No token provided.'});
  }
})
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
gcUnitRoutes.get('/myinfo', passport.authenticate('jwt', {session : false}) , function (req, res){
  var token = getToken(req.headers);
  if (token){
    return res.status(200).send({success: true, msg: 'Authorized'});
  }else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
})

function loggedIn (req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
      req.session.isAuthenticated = true;
      res.locals.isAuthenticated = true;
      res.locals.user =req.user; 
      console.log("req.user found...", req.user);
      next();
  } else {
      console.log("req.user not found... Login required.");
      //req.flash("errors", {login:"Please login first"});
      //res.render('/login', {bbscode:bbscode});
  }
}

// loginpartend**************************************************

// Upload && create mongodb start************************* 
gcUnitRoutes.post('/upload/editor', upload.single('editor'), (req, res) =>{
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file});

  var editor = [];

  csv.fromPath(req.file.path,{
    headers: true,
    ignoreEmpty: true
  }).on("data", function(data){
    
    data['_id'] = new mongoose.Types.ObjectId();
    editor.push(data);

  }).on("end", function(){
    Editor.deleteMany().exec();
    Editor.create(editor, function(err, documents){
      if(err) throw err;
    });
    console.log(editor);
  });

  try {
    fs.unlinkSync(req.file.path);
  } catch(e) {
    console.log(e);
  }


});

gcUnitRoutes.post('/upload/bookcode', upload.single('bookcode'), (req, res) =>{
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file});

  var bookcode = [];

  csv.fromPath(req.file.path,{
    headers: true,
    ignoreEmpty: true
  }).on("data", function(data){
    data['_id'] = new mongoose.Types.ObjectId();
    bookcode.push(data);

  }).on("end", function(){
    Bookcode.deleteMany().exec();
    Bookcode.create(bookcode, function(err, documents){
      if(err) throw err;
    });
    console.log(bookcode);
  });

  try {
    fs.unlinkSync(req.file.path);
  } catch(e) {
    console.log(e);
  }

});

gcUnitRoutes.post('/upload/contract', upload.single('contract'), (req, res) =>{
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file});

  var contract = [];

  csv.fromPath(req.file.path,{
    headers: true,
    ignoreEmpty: true
  }).on("data", function(data){
    data['_id'] = new mongoose.Types.ObjectId();
    contract.push(data);

  }).on("end", function(){
    Contract.deleteMany().exec();
    Contract.create(contract, function(err, documents){
      if(err) throw err;
    });
    console.log(contract);
  });

  try {
    fs.unlinkSync(req.file.path);
  } catch(e) {
    console.log(e);
  }

});

gcUnitRoutes.post('/upload/paylist', upload.single('paylist'), (req, res) =>{
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file});

  let paylist = [];

  csv.fromPath(req.file.path,{
    headers: true,
    ignoreEmpty: true
  }).on("data", function(data){
    data['_id'] = new mongoose.Types.ObjectId();
    paylist.push(data);

  }).on("end", function(){
    Paylist.update(paylist, function(err,docs){
      if(err) throw err;
    },{upsert:true});
    console.log(paylist);
  });

  try {
    fs.unlinkSync(req.file.path);
  } catch(e) {
    console.log(e);
  }

});

gcUnitRoutes.post('/upload/payday', upload.single('payday'), (req, res) =>{
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file});
  

  var payday = [];

  csv.fromPath(req.file.path,{
    headers: true,
    ignoreEmpty: true
  }).on("data", function(data){
    data['_id'] = new mongoose.Types.ObjectId();
    payday.push(data);

  }).on("end", function(){
    /*Payday.count({}).exec(function(err,result){
      if(result>0){
        Payday.update(payday, function(err,docs){
          if(err) throw err;
        },{upsert:true});
        console.log(payday);
      }else{
        Payday.create(payday, function(err,docs){
          if(err) throw err;
        },{upsert:true});
        console.log(payday);
      }
    });*/
    Payday.deleteMany().exec();
    Payday.create(payday, function(err, documents){
      if(err) throw err;
    });

    bnpanal().then(function(result){
      return halfofyear();
    });
    console.log('수불내역업데이트완료');
    
    
  });

  try {
    fs.unlinkSync(req.file.path);
  } catch(e) {
    console.log(e);
  }

});




// Upload && create mongodb END*************************

// admin editor manage api Start*************************
gcUnitRoutes.get('/editorchart', function(req,res,next){
  var paged;
  if(req.query.page == null){
    paged = 1;
  }else{
    paged = req.query.page;
  }
  var query = req.query.저자;
  if(query == null){
    Editor.paginate({}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    })
  }else{
    Editor.paginate({저자: query}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    })
  }
  
});

gcUnitRoutes.post('/editorchart', function(req,res){
  console.log(req.body)
  let user = new Editor(req.body);
  user._id = new mongoose.Types.ObjectId();
  user.save(function(err) {
    if(err){
      console.log(err);
    } else {
      res.json(user)
    }
  });
})

gcUnitRoutes.put('/editorchart/:id', function(req,res){
  Editor.findById(req.body._id, function(err, editor) {

      if(err) return res.status(500).json({ error: 'database failure'});
      if(!editor) return res.status(404).json({error:'editor not found'});

      if(req.body.저자) editor.저자 = req.body.저자;
      if(req.body.소속) editor.소속 = req.body.소속;
      if(req.body.은행) editor.은행 = req.body.은행;
      if(req.body.계좌번호) editor.계좌번호 = req.body.계좌번호;
      if(req.body.연락처_01) editor.연락처_01 = req.body.연락처_01;
      if(req.body.연락처_02) editor.연락처_02 = req.body.연락처_02;
      if(req.body.팩스) editor.팩스 = req.body.팩스;
      if(req.body.이메일) editor.이메일 = req.body.이메일;
      if(req.body.주민번호) editor.주민번호 = req.body.주민번호;
      if(req.body.주소) editor.주소 = req.body.주소;
      if(req.body.비고_01) editor.비고_01 = req.body.비고_01;
      if(req.body.비고_02) editor.비고_02 = req.body.비고_02;
      if(req.body.비고_03) editor.비고_03 = req.body.비고_03;
      if(req.body.구분) editor.구분 = req.body.구분;
        editor.save(function(err){
          if(err) res.status(500).json({error: 'fail to updtae'});
          res.json({message: 'updated successfully'})
        })
  });
})

gcUnitRoutes.delete('/editorchart/:id', function(req,res){
    Editor.findByIdAndRemove(req.params.id,req.body, function(err, gcUnit){
        if(err) {
          console.log(err);
          res.json(err);
        }
        else {
          console.log('successfully removed');
          res.json('Successfully removed');
    }
    });
})
// admin editor manage api END*************************

// admin editor managefix api Start*************************
gcUnitRoutes.post('/editoradd', function(req,res){
  console.log(req)
  let editor = new Editor();
  if(req.body.author) editor.저자 = req.body.author;
  if(req.body.org) editor.소속 = req.body.org;
  if(req.body.bank) editor.은행 = req.body.bank;
  if(req.body.bankaccount) editor.계좌번호 = req.body.bankaccount;
  if(req.body.cel1) editor.연락처_01 = req.body.cel1;
  if(req.body.cel2) editor.연락처_02 = req.body.cel2;
  if(req.body.email) editor.이메일 = req.body.email;
  if(req.body.RRN) editor.주민번호 = req.body.RRN;
  if(req.body.addr) editor.주소 = req.body.addr;
  if(req.body.비고_01) editor.비고_01 = req.body.비고_01;
  if(req.body.비고_02) editor.비고_02 = req.body.비고_02;
  if(req.body.비고_03) editor.비고_03 = req.body.비고_03;
  if(req.body.구분) editor.구분 = req.body.구분;
  editor._id = new mongoose.Types.ObjectId();
  editor.save(function(err) {
    if(err){
      console.log(err);
    } else {
      res.json(editor)
    }
  });
});

gcUnitRoutes.post('/editorsearch', function(req,res){
  Editor.findOne({저자:req.body.query},function(err,result){
    if(err){console.log(err)};

    res.json(result);
  })
})

// admin editor managefix api END*************************

// admin book managefix api START*************************
gcUnitRoutes.post('/bookadd', function(req,res){
  console.log(req)
  let book = new Bookcode();
  if(req.body.barcode) book.바코드 = req.body.barcode;
  if(req.body.bookcode) book.도서코드 = req.body.bookcode;
  if(req.body.bookname) book.도서명 = req.body.bookname;
  if(req.body.author) book.저자 = req.body.author;
  if(req.body.relday) book.신간일 = req.body.relday;
  if(req.body.from) book.발행처 = req.body.from;
  if(req.body.price) book.정가 = req.body.price;
  if(req.body.totalnumber) book.총재고 = req.body.totalnumber;
  if(req.body.homenumber) book.본사재고 = req.body.homenumber;
  if(req.body.genuinenumber) book.정품재고 = req.body.genuinenumber;
  if(req.body.refundnumber) book.반품재고 = req.body.refundnumber;
  book._id = new mongoose.Types.ObjectId();
  book.save(function(err) {
    if(err){
      console.log(err);
    } else {
      res.json(book)
    }
  });
});

// admin book managefix api END*************************

// admin book manage api Start*************************
gcUnitRoutes.get('/bookcode', function(req,res,next){
  var paged;
  if(req.query.page == null){
    paged = 1;
  }else{
    paged = req.query.page;
  }
  var query = req.query.바코드;
  if(query == null){
    Bookcode.paginate({}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    })
  }else{
    Bookcode.paginate({바코드:query}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    })
  };
  
});

gcUnitRoutes.post('/bookcode', function(req,res){
  console.log(req.body)
  let user = new Bookcode(req.body);
  user._id = new mongoose.Types.ObjectId();
  user.save(function(err) {
    if(err){
      console.log(err);
    } else {
      res.json(user)
    }
  });
})

gcUnitRoutes.put('/bookcode/:id', function(req,res){
  Bookcode.findById(req.body._id, function(err, book) {

      if(err) return res.status(500).json({ error: 'database failure'});
      if(!book) return res.status(404).json({error:'book not found'});

      if(req.body.바코드) book.바코드 = req.body.바코드;
      if(req.body.도서코드) book.도서코드 = req.body.도서코드;
      if(req.body.도서명) book.도서명 = req.body.도서명;
      if(req.body.저자) book.저자 = req.body.저자;
      if(req.body.신간일) book.신간일 = req.body.신간일;
      if(req.body.발행처) book.발행처 = req.body.발행처;
      if(req.body.정가) book.정가 = req.body.정가;
      if(req.body.총재고) book.총재고 = req.body.총재고;
      if(req.body.본사재고) book.본사재고 = req.body.본사재고;
      if(req.body.정품재고) book.정품재고 = req.body.정품재고;
      if(req.body.반품재고) book.반품재고 = req.body.반품재고;
        book.save(function(err){
          if(err) res.status(500).json({error: 'fail to updtae'});
          res.json({message: 'updated successfully'})
        })
  });
})

gcUnitRoutes.delete('/bookcode/:id', function(req,res){
    Bookcode.findByIdAndRemove(req.params.id,req.body, function(err, gcUnit){
        if(err) {
          console.log(err);
          res.json(err);
        }
        else {
          console.log('successfully removed');
          res.json('Successfully removed');
    }
    });
})
// admin book manage api END*************************
// admin payday manage api Start*************************
gcUnitRoutes.get('/payday', function(req,res,next){
  var paged;
  if(req.query.page == null){
    paged = 1;
  }else{
    paged = req.query.page;
  }
  var query = req.query;
  console.log(query);
  if(query.도서명){
    Payday.paginate({도서명: { $regex: '.*' + query.도서명 + '.*'}}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    });
  }else if(query.서점명){
    Payday.paginate({서점명:{ $regex: '.*' + query.서점명 + '.*'}}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    });
  }else{
    Payday.paginate({}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    })
  };
  
});

gcUnitRoutes.post('/payday', function(req,res){
  console.log(req.body)
  let user = new Payday(req.body);
  user._id = new mongoose.Types.ObjectId();
  user.save(function(err) {
    if(err){
      console.log(err);
    } else {
      res.json(user)
    }
  });
})

gcUnitRoutes.put('/payday/:id', function(req,res){
  Payday.findById(req.body._id, function(err, rev) {

      if(err) return res.status(500).json({ error: 'database failure'});
      if(!rev) return res.status(404).json({error:'rev not found'});

      if(req.body.일자) rev.바코드 = req.body.일자;
      if(req.body.바코드) rev.바코드 = req.body.바코드;
      if(req.body.도서명) rev.도서명 = req.body.도서명;
      if(req.body.정가) rev.정가 = req.body.정가;
      if(req.body.서점명) rev.서점명 = req.body.서점명;
      if(req.body.매출부수) rev.매출부수 = req.body.매출부수;
      if(req.body.매출금액) rev.매출금액 = req.body.매출금액;
      if(req.body.신간일자) rev.신간일자 = req.body.신간일자;
      if(req.body.저자) rev.저자 = req.body.저자;
        rev.save(function(err){
          if(err) res.status(500).json({error: 'fail to updtae'});
          res.json({message: 'updated successfully'})
        })
  });
})

gcUnitRoutes.delete('/payday/:id', function(req,res){
    Payday.findByIdAndRemove(req.params.id,req.body, function(err, gcUnit){
        if(err) {
          console.log(err);
          res.json(err);
        }
        else {
          console.log('successfully removed');
          res.json('Successfully removed');
    }
    });
})
// admin payday manage api END*************************
// admin paylist manage api Start*************************
gcUnitRoutes.get('/paylist', function(req,res,next){
  var paged;
  if(req.query.page == null){
    paged = 1;
  }else{
    paged = req.query.page;
  }
  
  //Paylist.count({},function(err,totalnum){  })
  Paylist.paginate({}, {page: paged , limit: 10}, function(err, result){
    if(err){
      console.log(err);
    }
    else {
      res.json(result);
    }
  })
  
});

// admin paylist manage api END*************************
// editor paylist manage api START*************************
gcUnitRoutes.get('/editorpay', passport.authenticate('jwt', {session : false}) , function (req, res){
  var token = getToken(req.headers);
  var user = req.user.저자;
  if (token){
    Royalti.find({저자: new RegExp(user, 'i')},function(err,result){
      res.json(result);
    })
  }else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
})

// editor paylist api END*************************
// admin payday manage api Start*************************
gcUnitRoutes.get('/royalti', function(req,res,next){
  var paged;
  if(req.query.page == null){
    paged = 1;
  }else{
    paged = req.query.page;
  }
  var query = req.query;
  console.log(query);
  if(query.일자){
    Royalti.paginate({일자: { $regex: '.*' + query.일자 + '.*'}}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    });
  }else if(query.저자){
    Royalti.paginate({저자:{ $regex: '.*' + query.저자 + '.*'}}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    });
  }else if(query.도서명){
    Royalti.paginate({저자:{ $regex: '.*' + query.도서명 + '.*'}}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    });
  }else{
    Royalti.paginate({}, {page: paged , limit: 10}, function(err, result){
      if(err){
        console.log(err);
      }
      else {
        res.json(result);
      }
    })
  };
  
});

gcUnitRoutes.post('/royalti', function(req,res){
  console.log(req.body)
  let user = new Royalti(req.body);
  user._id = new mongoose.Types.ObjectId();
  user.save(function(err) {
    if(err){
      console.log(err);
    } else {
      res.json(user)
    }
  });
})

gcUnitRoutes.put('/royalti/:id', function(req,res){
  Royalti.findById(req.body._id, function(err, rev) {

      if(err) return res.status(500).json({ error: 'database failure'});
      if(!rev) return res.status(404).json({error:'rev not found'});

      if(req.body.일자) rev.일자 = req.body.일자;
      if(req.body.저자) rev.저자 = req.body.저자;
      if(req.body.도서명) rev.도서명 = req.body.도서명;
      if(req.body.서점명) rev.서점명 = req.body.서점명;
      if(req.body.인세금액) rev.인세금액 = req.body.인세금액
      
        rev.save(function(err){
          if(err) res.status(500).json({error: 'fail to updtae'});
          res.json({message: 'updated successfully'})
        })
  });
})

gcUnitRoutes.delete('/royalti/:id', function(req,res){
    Royalti.findByIdAndRemove(req.params.id,req.body, function(err, gcUnit){
        if(err) {
          console.log(err);
          res.json(err);
        }
        else {
          console.log('successfully removed');
          res.json('Successfully removed');
    }
    });
})
// admin payday manage api END*************************


module.exports = gcUnitRoutes;