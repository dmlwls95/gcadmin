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
const json2xls = require('json2xls');
// Require model in our routes module
var Editor = require('../models/editor.js');
var Bookcode = require('../models/bookcode.js');
var Contract = require('../models/contractdb.js');
var Paylist = require('../models/paylistdb.js');
var Payday = require('../models/payday.js');
var Royalti = require('../models/royalti.js');
var Payed = require('../models/payed.js');
var Counsel = require('../models/counsel.js');
var Edition = require('../models/edition.js');
var Process = require('../models/process.js');
bnpanal = require('../services/services.js').bnpanal;
halfofyear = require('../services/services.js').halfofyear;
calcroyalti = require('../services/services.js').calcroyalti;
logging = require('../services/services.js').logging;
standardofprice = require('../services/services.js').standardofprice;
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    }
  })
});

gcUnitRoutes.use(json2xls.middleware);
// Defined store route
gcUnitRoutes.get('/', function(req, res, next) {
  res.render('../dist/index.html');
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
  Editor.findOne(
    {
      id: req.body.username
    },
    function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: 'Authentication failed. User not found.'
        });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            var payload = {
              name: user.저자,
              email: user.이메일
            };
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), config.secret, {
              expiresIn: '30m'
            });
            // return the information including token as JSON
            res.json({ success: true, token: 'JWT ' + token });
          } else {
            res.status(401).send({
              success: false,
              msg: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    }
  );
});
gcUnitRoutes.get(
  '/auth',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    let token = getToken(req.headers); // req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['authorization'];

    //decode token
    if (token) {
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          return res.json(decoded);
        }
      });
    } else {
      return res
        .status(403)
        .send({ success: false, message: 'No token provided.' });
    }
  }
);
getToken = function(headers) {
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
gcUnitRoutes.get(
  '/myinfo',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      return res.status(200).send({ success: true, msg: 'Authorized' });
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  }
);

function loggedIn(req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    req.session.isAuthenticated = true;
    res.locals.isAuthenticated = true;
    res.locals.user = req.user;
    console.log('req.user found...', req.user);
    next();
  } else {
    console.log('req.user not found... Login required.');
    //req.flash("errors", {login:"Please login first"});
    //res.render('/login', {bbscode:bbscode});
  }
}

gcUnitRoutes.post(
  '/myinfov1',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let token = getToken(req.headers);
    if (token) {
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
          return res.json({
            success: false,
            message: 'Failed to authenticate token.'
          });
        } else {
          let username = req.body.username;
          let password = req.body.password;
          Editor.findById({ _id: decoded._id }, (err, result) => {
            if (err) console.log(err);
            result.id = username;
            result.pw = password;
            result.save();
          });
          return res.status(200).send({ success: true, msg: 'Authorized' });
        }
      });
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  }
);

// loginpartend**************************************************

// Upload && create mongodb start*************************
gcUnitRoutes.post('/upload/editor', upload.single('editor'), (req, res) => {
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file });

  var editor = [];

  csv
    .fromPath(req.file.path, {
      headers: true,
      ignoreEmpty: true
    })
    .on('data', function(data) {
      data['_id'] = new mongoose.Types.ObjectId();
      editor.push(data);
    })
    .on('end', function() {
      Editor.deleteMany().exec();
      Editor.create(editor, function(err, documents) {
        if (err) throw err;
      });
      console.log(editor);
    });

  try {
    fs.unlinkSync(req.file.path);
  } catch (e) {
    console.log(e);
  }
});

gcUnitRoutes.post('/upload/bookcode', upload.single('bookcode'), (req, res) => {
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file });

  var bookcode = [];

  csv
    .fromPath(req.file.path, {
      headers: true,
      ignoreEmpty: true
    })
    .on('data', function(data) {
      data['_id'] = new mongoose.Types.ObjectId();
      bookcode.push(data);
    })
    .on('end', function() {
      Bookcode.deleteMany().exec();
      Bookcode.create(bookcode, function(err, documents) {
        if (err) throw err;
      });
      console.log(bookcode);
    });

  try {
    fs.unlinkSync(req.file.path);
  } catch (e) {
    console.log(e);
  }
});

gcUnitRoutes.post('/upload/contract', upload.single('contract'), (req, res) => {
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file });

  var contract = [];

  csv
    .fromPath(req.file.path, {
      headers: true,
      ignoreEmpty: true
    })
    .on('data', function(data) {
      data['_id'] = new mongoose.Types.ObjectId();
      contract.push(data);
    })
    .on('end', function() {
      Contract.deleteMany().exec();
      Contract.create(contract, function(err, documents) {
        if (err) throw err;
      });
      console.log(contract);
    });

  try {
    fs.unlinkSync(req.file.path);
  } catch (e) {
    console.log(e);
  }
});

gcUnitRoutes.post('/upload/paylist', upload.single('paylist'), (req, res) => {
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file });

  let paylist = [];

  csv
    .fromPath(req.file.path, {
      headers: true,
      ignoreEmpty: true
    })
    .on('data', function(data) {
      data['_id'] = new mongoose.Types.ObjectId();
      paylist.push(data);
    })
    .on('end', function() {
      Paylist.update(
        paylist,
        function(err, docs) {
          if (err) throw err;
        },
        { upsert: true }
      );
      console.log(paylist);
    });

  try {
    fs.unlinkSync(req.file.path);
  } catch (e) {
    console.log(e);
  }
});

gcUnitRoutes.post('/upload/payday', upload.single('payday'), (req, res) => {
  console.log('uploaded', req.file);
  res.json({ success: true, file: req.file });

  let tmp = [];
  
  csv
    .fromPath(req.file.path, {
      headers: true,
      ignoreEmpty: true
    })
    .on('data', function(data) {
      /*data['_id'] = new mongoose.Types.ObjectId();
      payday.push(data);*/
      let date = data.일자;
      let year = date.substr(0,4);
      let month = date.substr(4,2);
      let day = date.substr(6,2);
      let tdate = new Date(year, month-1, day);
      tdate.setDate(tdate.getDate()+1);
      let payday = new Payday(data);
      payday.일자 = tdate;
      payday._id = new mongoose.Types.ObjectId();
      payday.payed = false;
      payday.save();
      return new Promise(function(resolved,rejected){
        setTimeout(
              function(){
                    resolved('done');
              },1000);
      });

    })
    .on('end', function() {
      bnpanal().then(function(result) {
        //calcroyalti();
        return standardofprice();
      });
      console.log('수불내역업데이트완료');
    });

  try {
    fs.unlinkSync(req.file.path);
  } catch (e) {
    console.log(e);
  }
});

// Upload && create mongodb END*************************

// admin editor manage api Start*************************
gcUnitRoutes.get('/editorchart', function(req, res, next) {
  var paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }
  var query = req.query;
  console.log(query);
  if (query.저자) {
    Editor.paginate(
      { 저자: { $regex: '.*' + query.저자 + '.*' } },
      { page: paged, limit: 3 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.주민번호) {
    Editor.paginate(
      { 주민번호: { $regex: '.*' + query.주민번호 + '.*' } },
      { page: paged, limit: 3 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else {
    Editor.paginate({}, { page: paged, limit: 3 }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  }
});

gcUnitRoutes.post('/editorchart', function(req, res) {
  console.log(req.body);
  let user = new Editor(req.body);
  user._id = new mongoose.Types.ObjectId();
  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

gcUnitRoutes.put('/editorchart/:id', function(req, res) {
  Editor.findById(req.body._id, function(err, editor) {
    if (err) return res.status(500).json({ error: 'database failure' });
    if (!editor) return res.status(404).json({ error: 'editor not found' });

    if (req.body.저자) editor.저자 = req.body.저자; else if(req.body.저자 ==null) editor.저자 = '';
    if (req.body.소속) editor.소속 = req.body.소속; else if(req.body.소속 ==null) editor.소속 = '';
    if (req.body.직위) editor.직위 = req.body.직위; else if(req.body.직위 ==null) editor.직위 = '';
    if (req.body.연락처_휴대전화) editor.연락처_휴대전화 = req.body.연락처_휴대전화;  else if(req.body.연락처_휴대전화 ==null) editor.연락처_휴대전화 = '';
    if (req.body.연락처_02) editor.연락처_02 = req.body.연락처_02;  else if(req.body.연락처_02 ==null) editor.연락처_02 = '';
    if (req.body.팩스) editor.팩스 = req.body.팩스; else if(req.body.팩스 ==null) editor.팩스 = '';
    if (req.body.이메일) editor.이메일 = req.body.이메일; else if(req.body.이메일 ==null) editor.이메일 = '';
    if (req.body.사업자번호) editor.사업자번호 = req.body.사업자번호; else if(req.body.사업자번호 ==null) editor.사업자번호 = '';
    if (req.body.구분) editor.구분 = req.body.구분; else if(req.body.구분 ==null) editor.구분 = '';
    if (req.body.은행) editor.은행 = req.body.은행; else if(req.body.은행 ==null) editor.은행 = '';
    if (req.body.계좌번호) editor.계좌번호 = req.body.계좌번호; else if(req.body.계좌번호 ==null) editor.계좌번호 = '';
    if (req.body.예금주) editor.예금주 = req.body.예금주; else if(req.body.예금주 ==null) editor.예금주 = '';
    if (req.body.주소_직장) editor.주소_직장 = req.body.주소_직장;  else if(req.body.주소_직장 ==null) editor.주소_직장 = '';
    if (req.body.주소_자택) editor.주소_자택 = req.body.주소_자택;  else if(req.body.주소_자택 ==null) editor.주소_자택 = '';
    if (req.body.비고_01) editor.비고_01 = req.body.비고_01;  else if(req.body.비고_01 ==null) editor.비고_01 = '';
    if (req.body.비고_02) editor.비고_02 = req.body.비고_02;  else if(req.body.비고_02 ==null) editor.비고_02 = '';
    if (req.body.전공) editor.전공 = req.body.전공; else if(req.body.전공 ==null) editor.전공 = '';
    if (req.body.기념일) editor.기념일 = req.body.기념일; else if(req.body.기념일 ==null) editor.기념일 = '';
    if (req.body.id) editor.id = req.body.id;
    if (req.body.pw) editor.pw = req.body.pw;
    editor.save(function(err) {
      if (err) res.status(500).json({ error: 'fail to updtae' });
      res.json({ message: 'updated successfully' });
    });
  });
});

gcUnitRoutes.delete('/editorchart/:id', function(req, res) {
  Editor.findByIdAndRemove(req.params.id, req.body, function(err, gcUnit) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log('successfully removed');
      res.json('Successfully removed');
    }
  });
});
// admin editor manage api END*************************

// admin editor managefix api Start*************************
gcUnitRoutes.post('/editoradd', function(req, res) {
  Editor.findOne({ 저자: req.body.author }, (err, result) => {
    if (err) return res.status(500).json({ error: 'database failure' });
    if (result) {
      if (req.body.author) result.저자 = req.body.author; else result.저자 = '';
      if (req.body.org) result.소속 = req.body.org; else result.소속 = '';
      if (req.body.hierarchy) result.직위 = req.body.hierarchy; else result.직위 = '';
      if (req.body.cel1) result.연락처_휴대전화 = req.body.cel1; else result.연락처_휴대전화 = '';
      if (req.body.cel2) result.연락처_02 = req.body.cel2; else result.연락처_02 = '';
      if (req.body.fax) result.팩스 = req.body.fax; else result.팩스 = '';
      if (req.body.email) result.이메일 = req.body.email; else result.이메일 = '';
      if (req.body.busn) result.사업자번호 = req.body.busn; else result.사업자번호 = '';
      if (req.body.cate) result.구분 = req.body.cate; else result.구분 = '';
      if (req.body.bank) result.은행 = req.body.bank; else result.은행 = '';
      if (req.body.bankaccount) result.계좌번호 = req.body.bankaccount; else result.계좌번호 = '';
      if (req.body.bankaccount_owner) result.예금주 = req.body.bankaccount_owner;else result.예금주 = '';
      if (req.body.addr_comp) result.주소_직장 = req.body.addr_comp; else result.주소_직장 = '';
      if (req.body.addr_home) result.주소_자택 = req.body.addr_home; else result.주소_자택 = '';
      if (req.body.bigo_01) result.비고_01 = req.body.bigo_01; else result.비고_01 = '';
      if (req.body.bigo_02) result.비고_02 = req.body.bigo_02; else result.비고_02 = '';
      if (req.body.major) result.전공 = req.body.major; else result.전공 = '';
      if (req.body.anniversary) result.기념일 = req.body.anniversary; else result.기념일 = '';
      if (req.body.id) result.id = req.body.id; else result.id = '';
      if (req.body.pw) result.pw = req.body.pw; else result.pw = '';
      result.save(function(err) {
        if (err) res.status(500).json({ error: 'fail to updtae' });
        res.json({ message: 'updated successfully' });
      });
    } else {
      res.status(404).json({ message: 'no one found in editorDB'})
    }
  });
});
gcUnitRoutes.post('/editoraddnew', (req,res)=>{
  let editor = new Editor();
  if (req.body.author) editor.저자 = req.body.author; else editor.저자 = '';
  if (req.body.org) editor.소속 = req.body.org; else editor.소속 = '';
  if (req.body.hierarchy) editor.직위 = req.body.hierarchy; else editor.직위 = '';
  if (req.body.cel1) editor.연락처_휴대전화 = req.body.cel1; else editor.연락처_휴대전화 = '';
  if (req.body.cel2) editor.연락처_02 = req.body.cel2; else editor.연락처_02 = '';
  if (req.body.fax) editor.팩스 = req.body.fax; else editor.팩스 = '';
  if (req.body.email) editor.이메일 = req.body.email; else editor.이메일 = '';
  if (req.body.busn) editor.사업자번호 = req.body.busn; else editor.사업자번호 = '';
  if (req.body.cate) editor.구분 = req.body.cate; else editor.구분 = '';
  if (req.body.bank) editor.은행 = req.body.bank; else editor.은행 = '';
  if (req.body.bankaccount) editor.계좌번호 = req.body.bankaccount; else editor.계좌번호 = '';
  if (req.body.bankaccount_owner) editor.예금주 = req.body.bankaccount_owner;else editor.예금주 = '';
  if (req.body.addr_comp) editor.주소_직장 = req.body.addr_comp; else editor.주소_직장 = '';
  if (req.body.addr_home) editor.주소_자택 = req.body.addr_home; else editor.주소_자택 = '';
  if (req.body.bigo_01) editor.비고_01 = req.body.bigo_01; else editor.비고_01 = '';
  if (req.body.bigo_02) editor.비고_02 = req.body.bigo_02; else editor.비고_02 = '';
  if (req.body.major) editor.전공 = req.body.major; else editor.전공 = '';
  if (req.body.anniversary) editor.기념일 = req.body.anniversary; else editor.기념일 = '';
  if (req.body.id) editor.id = req.body.id; else editor.id = '';
  if (req.body.pw) editor.pw = req.body.pw; else editor.pw = '';
  editor._id = new mongoose.Types.ObjectId();
  Editor.insertMany(editor,(err,docs)=>{
    if(err) res.status(404).send(err);
    res.status(201).json(docs);
  })
})

gcUnitRoutes.get('/editorsearch', function(req, res) {
  Editor.find({}, function(err, result) {
    if (err) {
      console.log(err);
    }

    res.json(result);
  });
});

// admin editor managefix api END*************************

// admin book managefix api START*************************
gcUnitRoutes.post('/bookadd', function(req, res) {
  Bookcode.findOne({ 바코드: req.body.barcode }, (err, result) => {
    if (err) return res.status(500).json({ error: 'database failure' });
    if (result) {
      if (req.body.barcode) result.바코드 = req.body.barcode;
      if (req.body.bookcode) result.도서코드 = req.body.bookcode;
      if (req.body.bookname) result.도서명 = req.body.bookname;
      if (req.body.author) result.저자 = req.body.author;
      if (req.body.relday) result.발행일 = req.body.relday;
      if (req.body.from) result.발행처 = req.body.from;
      if (req.body.price) result.정가 = req.body.price;
      if (req.body.contactrange) result.계약기간 = req.body.contactrange;
      if (req.body.status) result.상태 = req.body.status;
      if (req.body.royaltipercent>=0) result.인세율 = req.body.royaltipercent;
      if (req.body.royaltijugi) result.인세주기 = req.body.royaltijugi;
      if (req.body.howroyalti) result.인세방식 = req.body.howroyalti;
      if (req.body.relnumber) result.발행부수 = req.body.relnumber;
      if (req.body.translate) result.저술_번역 = req.body.translate;
      if (req.body.agency) result.에이전시 = req.body.agency;
      if (req.body.originrel) result.원출판사 = req.body.originrel;
      if (req.body.royalti) result.로열티 = req.body.royalti;
      if (req.body.panhyng) result.판형 = req.body.panhyng;
      if (req.body.jaebon) result.제본 = req.body.jaebon;
      if (req.body.page) result.페이지 = req.body.page;
      if (req.body.bigo) result.비고 = req.body.bigo;
      if (req.body.response) result.담당자 = req.body.response;
      if (req.body.specialthing) result.특기사항 = req.body.specialthing;

      result.save(function(err) {
        if (err) res.status(500).json({ error: 'fail to updtae' });
        res.json({ message: 'updated successfully' });
      });
    }
  });
});
gcUnitRoutes.post('/bookaddnew', function(req, res) {
  let book = new Bookcode();
  if (req.body.barcode) book.바코드 = req.body.barcode;
  if (req.body.bookcode) book.도서코드 = req.body.bookcode;
  if (req.body.bookname) book.도서명 = req.body.bookname;
  if (req.body.author) book.저자 = req.body.author;
  if (req.body.relday) book.발행일 = req.body.relday;
  if (req.body.from) book.발행처 = req.body.from;
  if (req.body.price) book.정가 = req.body.price;
  if (req.body.contactrange) book.계약기간 = req.body.contactrange;
  if (req.body.status) book.상태 = req.body.status;
  if (req.body.royaltipercent>=0) book.인세율 = req.body.royaltipercent;
  if (req.body.royaltijugi) book.인세주기 = req.body.royaltijugi;
  if (req.body.howroyalti) book.인세방식 = req.body.howroyalti;
  if (req.body.relnumber) book.발행부수 = req.body.relnumber;
  if (req.body.translate) book.저술_번역 = req.body.translate;
  if (req.body.agency) book.에이전시 = req.body.agency;
  if (req.body.originrel) book.원출판사 = req.body.originrel;
  if (req.body.royalti) book.로열티 = req.body.royalti;
  if (req.body.panhyng) book.판형 = req.body.panhyng;
  if (req.body.jaebon) book.제본 = req.body.jaebon;
  if (req.body.page) book.페이지 = req.body.page;
  if (req.body.bigo) book.비고 = req.body.bigo;
  book._id = new mongoose.Types.ObjectId();

  Bookcode.insertMany(book,(err,docs)=>{
    if(err) res.status(404).send(err);
    res.status(201).json(docs);
  });
});

// admin book managefix api END*************************

// admin book manage api Start*************************
gcUnitRoutes.get('/bookcode', function(req, res, next) {
  var paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }
  var query = req.query;
  if (query.바코드) {
    Bookcode.paginate(
      { 바코드: { $regex: '.*' + query.바코드 + '.*' } },
      { page: paged, limit: 3 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.도서코드) {
    Bookcode.paginate(
      { 도서코드: { $regex: '.*' + query.도서코드 + '.*' } },
      { page: paged, limit: 3 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.도서명) {
    Bookcode.paginate(
      { 도서명: { $regex: '.*' + query.도서명 + '.*' } },
      { page: paged, limit: 3 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.저자) {
    Bookcode.paginate(
      { 저자: { $regex: '.*' + query.저자 + '.*' } },
      { page: paged, limit: 3 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else {
    Bookcode.paginate({}, { page: paged, limit: 3 }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  }
});
gcUnitRoutes.get('/bookcodebyten', function(req, res, next) {
  var paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }
  var query = req.query;
  if (query.바코드) {
    Bookcode.paginate(
      { 바코드: { $regex: '.*' + query.바코드 + '.*' } },
      { page: paged, limit: 10 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.도서코드) {
    Bookcode.paginate(
      { 도서코드: { $regex: '.*' + query.도서코드 + '.*' } },
      { page: paged, limit: 10 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.도서명) {
    Bookcode.paginate(
      { 도서명: { $regex: '.*' + query.도서명 + '.*' } },
      { page: paged, limit: 10 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.저자) {
    Bookcode.paginate(
      { 저자: { $regex: '.*' + query.저자 + '.*' } },
      { page: paged, limit: 10 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else {
    Bookcode.paginate({}, { page: paged, limit: 10 }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  }
});
gcUnitRoutes.post('/bookcodebyname', (req,res)=>{
  let name = req.body.name;
  Bookcode.find({저자:name}, (err,result)=>{
    if(err){
      console.log(err);
    }
    if(result.length){
      res.status(201).json(result);
    }else{
      Bookcode.find({},(err,all)=>{
        if(err) console.log(err)
        res.status(200).json(all);
      })
    }
    
  })
})
gcUnitRoutes.post('/bookcodebybook', (req,res)=>{
  let name = req.body.name;
  Bookcode.find({도서명:name}, (err,result)=>{
    if(err){
      console.log(err);
    }
    if(result.length){
      res.status(201).json(result);
    }else{
      Bookcode.find({},(err,all)=>{
        if(err) console.log(err)
        res.status(200).json(all);
      })
    }
    
  })
})
gcUnitRoutes.get('/bookcodesearch', function(req, res) {
  Bookcode.find({}, function(err, result) {
    if (err) {
      console.log(err);
    }

    res.json(result);
  });
});

gcUnitRoutes.post('/bookcode', function(req, res) {
  console.log(req.body);
  let user = new Bookcode(req.body);
  user._id = new mongoose.Types.ObjectId();
  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

gcUnitRoutes.put('/bookcode/:id', function(req, res) {
  Bookcode.findById(req.body._id, function(err, book) {
    if (err) return res.status(500).json({ error: 'database failure' });
    if (!book) return res.status(404).json({ error: 'book not found' });

    if (req.body.바코드) book.바코드 = req.body.바코드;
    if (req.body.도서코드) book.도서코드 = req.body.도서코드;
    if (req.body.도서명) book.도서명 = req.body.도서명;
    if (req.body.저자) book.저자 = req.body.저자;
    if (req.body.신간일) book.신간일 = req.body.신간일;
    if (req.body.발행처) book.발행처 = req.body.발행처;
    if (req.body.정가) book.정가 = req.body.정가;
    if (req.body.총재고) book.총재고 = req.body.총재고;
    if (req.body.본사재고) book.본사재고 = req.body.본사재고;
    if (req.body.정품재고) book.정품재고 = req.body.정품재고;
    if (req.body.반품재고) book.반품재고 = req.body.반품재고;
    book.save(function(err) {
      if (err) res.status(500).json({ error: 'fail to updtae' });
      res.json({ message: 'updated successfully' });
    });
  });
});

gcUnitRoutes.delete('/bookcode/:id', function(req, res) {
  Bookcode.findByIdAndRemove(req.params.id, req.body, function(err, gcUnit) {
    if (err) {
      console.log(err);
      res.status(404).json(err);
    } else {
      console.log('successfully removed');
      res.status(200).json('Successfully removed');
    }
  });
});
// admin book manage api END*************************
// admin payday manage api Start*************************
gcUnitRoutes.get('/payday', function(req, res, next) {
  var paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }
  var query = req.query;
  console.log(query);
  if (query.도서명) {
    Payday.paginate(
      { 도서명: { $regex: '.*' + query.도서명 + '.*' } },
      { page: paged, limit: 10 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.서점명) {
    Payday.paginate(
      { 서점명: { $regex: '.*' + query.서점명 + '.*' } },
      { page: paged, limit: 10 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else {
    Payday.paginate({}, { page: paged, limit: 10 }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  }
});

gcUnitRoutes.post('/payday', function(req, res) {
  console.log(req.body);
  let user = new Payday(req.body);
  user._id = new mongoose.Types.ObjectId();
  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

gcUnitRoutes.put('/payday/:id', function(req, res) {
  Payday.findById(req.body._id, function(err, rev) {
    if (err) return res.status(500).json({ error: 'database failure' });
    if (!rev) return res.status(404).json({ error: 'rev not found' });

    if (req.body.일자) rev.바코드 = req.body.일자;
    if (req.body.바코드) rev.바코드 = req.body.바코드;
    if (req.body.도서명) rev.도서명 = req.body.도서명;
    if (req.body.정가) rev.정가 = req.body.정가;
    if (req.body.서점명) rev.서점명 = req.body.서점명;
    if (req.body.매출부수) rev.매출부수 = req.body.매출부수;
    if (req.body.매출금액) rev.매출금액 = req.body.매출금액;
    if (req.body.신간일자) rev.신간일자 = req.body.신간일자;
    if (req.body.저자) rev.저자 = req.body.저자;
    rev.save(function(err) {
      if (err) res.status(500).json({ error: 'fail to updtae' });
      res.json({ message: 'updated successfully' });
    });
  });
});

gcUnitRoutes.delete('/payday/:id', function(req, res) {
  Payday.findByIdAndRemove(req.params.id, req.body, function(err, gcUnit) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log('successfully removed');
      res.json('Successfully removed');
    }
  });
});
// admin payday manage api END*************************
// admin paylist manage api Start*************************
gcUnitRoutes.get('/paylist', function(req, res, next) {
  var paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }

  //Paylist.count({},function(err,totalnum){  })
  Paylist.paginate({}, { page: paged, limit: 10 }, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});

// admin paylist manage api END*************************
// editor paylist manage api START*************************
gcUnitRoutes.get(
  '/editorpay',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    var user = req.user.저자;
    if (token) {
      Royalti.find({ 저자: new RegExp(user, 'i') }, function(err, result) {
        res.json(result);
      });
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  }
);

gcUnitRoutes.get(
  '/editorpayed',
  passport.authenticate('jwt', { session: false }),
  function(req, res) {
    var token = getToken(req.headers);
    var user = req.user.저자;
    if (token) {
      Payed.find({ 저자: new RegExp(user, 'i') }, function(err, result) {
        res.json(result);
      });
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  }
);

// editor paylist api END*************************
// admin payday manage api Start*************************
gcUnitRoutes.get('/royalti', function(req, res, next) {
  var paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }
  var query = req.query;
  console.log(query);
  if (query.일자) {
    Royalti.paginate(
      { 일자: { $regex: '.*' + query.일자 + '.*' } },
      { page: paged, limit: 10 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.저자) {
    Royalti.paginate(
      { 저자: { $regex: '.*' + query.저자 + '.*' } },
      { page: paged, limit: 10 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else if (query.도서명) {
    Royalti.paginate(
      { 저자: { $regex: '.*' + query.도서명 + '.*' } },
      { page: paged, limit: 10 },
      function(err, result) {
        if (err) {
          console.log(err);
        } else {
          res.json(result);
        }
      }
    );
  } else {
    Royalti.paginate({}, { page: paged, limit: 10 }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  }
});

gcUnitRoutes.post('/royalti', function(req, res) {
  console.log(req.body);
  let user = new Royalti(req.body);
  user._id = new mongoose.Types.ObjectId();
  user.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

gcUnitRoutes.put('/royalti/:id', function(req, res) {
  Royalti.findById(req.body._id, function(err, rev) {
    if (err) return res.status(500).json({ error: 'database failure' });
    if (!rev) return res.status(404).json({ error: 'rev not found' });

    if (req.body.일자) rev.일자 = req.body.일자;
    if (req.body.저자) rev.저자 = req.body.저자;
    if (req.body.도서명) rev.도서명 = req.body.도서명;
    if (req.body.서점명) rev.서점명 = req.body.서점명;
    if (req.body.인세금액) rev.인세금액 = req.body.인세금액;

    rev.save(function(err) {
      if (err) res.status(500).json({ error: 'fail to updtae' });
      res.json({ message: 'updated successfully' });
    });
  });
});

gcUnitRoutes.delete('/royalti/:id', function(req, res) {
  Royalti.findByIdAndRemove(req.params.id, req.body, function(err, gcUnit) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log('successfully removed');
      res.json('Successfully removed');
    }
  });
});
// admin payday manage api END*************************

// admin datepicker manage api START*************************
gcUnitRoutes.post('/daterange', function(req, res) {
  Royalti.find({ 일자: { $gte: req.body.start, $lt: req.body.end } }, function(
    err,
    result
  ) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});
// admin datepicker manage api END*************************
function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}
// admin datepickNcalc api START*************************
gcUnitRoutes.post('/daterangeNcalc', function(req, res) {
  Royalti.find(
    {
      $and: [
        { 일자: { $gte: req.body.start, $lt: req.body.end } },
        { payed: false }
      ]
    },
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        let booknames = new Array();
        result.forEach(data => {
          booknames.push(data.도서명);
        }); //booknames 엔 기간동안 모든 도서명들어감
        let groupedRes = groupBy(result, result => result.도서명); //그룹화 변수
        let single = booknames.reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []); //booknames의 책이름 중복 삭제
        let tosend = new Array();
        single.forEach(data => {
          let tmp = groupedRes.get(data); //그룹화 변수에 책이름 넣어서 돌림

          let idcol = new Array();
          let restmp = {
            저자: tmp[0].저자,
            도서명: tmp[0].도서명,
            인세금액: 0,
            ids: null
          };
          for (let i in tmp) {
            //인세는 인세끼리 합산
            if (tmp[i]) {
              restmp.인세금액 = restmp.인세금액 + tmp[i].인세금액;
            } else {
              restmp.인세금액 = restmp.인세금액 + 0;
            }
            idcol.push(tmp[i]._id);
          }
          restmp.ids = idcol;
          tosend.push(restmp);
        });
        res.send(tosend);
      }
    }
  );
});

gcUnitRoutes.post('/daterangecalctoexl', function(req, res) {
  Royalti.find(
    {
      $and: [
        { 일자: { $gte: req.body.start, $lt: req.body.end } },
        { payed: false }
      ]
    },
    function(err, result) {
      
      if (err) {
        console.log(err);
      } else {
        let booknames = new Array();
        result.forEach(data => {
          booknames.push(data.도서명);
        }); //booknames 엔 기간동안 모든 도서명들어감
        let groupedRes = groupBy(result, result => result.도서명); //그룹화 변수
        let single = booknames.reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []); //booknames의 책이름 중복 삭제

        
        
        Editor.find({})
        .then(user=>{
          const tosend4exl = new Array();
          single.forEach(data=>{
            let tmp = groupedRes.get(data);
            let val = user.find((item,idx)=>{
              return item.저자 === tmp[0].저자;
            });
            //val이 저자를 찾은값
            if(err) console.log('err when find editor');
              let idcol = new Array();
              let restmp = {
                저자: tmp[0].저자,
                예금주: '',
                은행: '',
                계좌번호: '',
                도서명: tmp[0].도서명,
                인세금액: 0,
                ids: null
              };
              if(val){
                restmp.예금주 = val.예금주;
                restmp.은행 = val.은행;
                restmp.계좌번호 = val.계좌번호
              }else{
                restmp.예금주 = '저자DB에서 해당 저자를 찾을 수 없습니다';
                restmp.은행 = '저자DB에서 해당 저자를 찾을 수 없습니다';
                restmp.계좌번호 = '저자DB에서 해당 저자를 찾을 수 없습니다'
              }
              for (let i in tmp) {
                //인세는 인세끼리 합산
                if (tmp[i]) {
                  restmp.인세금액 = restmp.인세금액 + tmp[i].인세금액;
                } else {
                  restmp.인세금액 = restmp.인세금액 + 0;
                }
                idcol.push(tmp[i]._id);
              }
              restmp.ids = idcol;
              tosend4exl.push(restmp)
          })
          res.send(tosend4exl);
        })


         
      }
    }
  );
});
// admin datepickNcalc api END*************************
// revenue daterangepicker api END*************************
gcUnitRoutes.post('/revenuerangeNcalc', function(req, res) {
  Payday.find(
    {
      $and: [
        { 일자: { $gte: req.body.start, $lt: req.body.end } }
      ]
    },
    function(err, result) {
      if (err) {
        console.log(err);
      } else {
        let booknames = new Array();
        result.forEach(data => {
          booknames.push(data.도서명);
        }); //booknames 엔 기간동안 모든 도서명들어감
        let groupedRes = groupBy(result, result => result.도서명); //그룹화 변수
        let single = booknames.reduce((a, b) => {
          if (a.indexOf(b) < 0) a.push(b);
          return a;
        }, []); //booknames의 책이름 중복 삭제
        let tosend = new Array();
        single.forEach(data => {
          let tmp = groupedRes.get(data); //그룹화 변수에 책이름 넣어서 돌림

          let idcol = new Array();
          let restmp = {
            바코드: tmp[0].바코드,
            도서명: tmp[0].도서명,
            정가: tmp[0].정가,
            서점명: tmp[0].서점명,
            제본소입고부수: tmp[0].제본소입고부수,
            제본소_외_입고부수: tmp[0].제본소_외_입고부수,
            저자: tmp[0].저자,
            매출부수: 0,
            매출금액: 0,
            본사이동부수: 0,
            증정부수: 0,
            반품부수: 0,
            반품금액: 0,
            폐기부수: 0,
            현정품재고: 0,
            현반품재고: 0,
            순매출부수: 0,
            순매출금액: 0,
            신간일자: tmp[0].신간일자,
            ids: null
          };
          for (let i in tmp) {
            //매출은 매출끼리 합산
            if (tmp[i]) {
              restmp.매출부수 = restmp.매출부수 + tmp[i].매출부수;
              restmp.매출금액 = restmp.매출금액 + tmp[i].매출금액;
              restmp.본사이동부수 = restmp.본사이동부수 + tmp[i].본사이동부수;
              restmp.증정부수 = restmp.증정부수 + tmp[i].증정부수;
              restmp.반품부수 = restmp.반품부수 + tmp[i].반품부수;
              restmp.반품금액 = restmp.반품금액 + tmp[i].반품금액;
              restmp.폐기부수 = restmp.폐기부수 + tmp[i].폐기부수;
              restmp.현정품재고 = restmp.현정품재고 + tmp[i].현정품재고;
              restmp.현반품재고 = restmp.현반품재고 + tmp[i].현반품재고;
              restmp.순매출부수 = restmp.순매출부수 + tmp[i].순매출부수;
              restmp.순매출금액 = restmp.순매출금액 + tmp[i].순매출금액;
            } else {
              restmp.매출부수 += 0;
              restmp.매출금액 = restmp.매출금액 + 0;
              restmp.본사이동부수 += 0;
              restmp.증정부수 += 0;
              restmp.반품부수 += 0;
              restmp.반품금액 += 0;
              restmp.폐기부수 += 0;
              restmp.현정품재고 += 0;
              restmp.현반품재고 += 0;
              restmp.순매출부수 += 0;
              restmp.순매출금액 += 0;
            }
            idcol.push(tmp[i]._id);
          }
          restmp.ids = idcol;
          tosend.push(restmp);
        });
        res.send(tosend);
      }
    }
  );
});
// admin datepickNcalc api END*************************

// admin paying api START*************************
gcUnitRoutes.post('/paying', function(req, res) {
  let tmp = req.body;
  for (var i in tmp) {
    let payed = new Payed();
    payed._id = new mongoose.Types.ObjectId();
    payed.일자 = Date.now();
    if (tmp[i].저자) payed.저자 = tmp[i].저자;
    if (tmp[i].도서명) payed.도서명 = tmp[i].도서명;
    payed.인세금액 = tmp[i].인세금액;
    if (tmp[i].payed) payed.payed = true;
    payed.save(function(err) {
      console.log(err);
      if (err) res.status(500).json({ error: 'fail to save' });
    });
    let _ids = tmp[i].ids;
    _ids.forEach(data => {
      Royalti.findById({ _id: data }, (err, result) => {
        if (err) console.log(err);
        result.payed = true;
        result.save(err => {
          if (err) res.status(500).json({ error: 'fail to update' });
        });
        Payday.findById({ _id: result.idofpayday},(err,sndresult)=>{
          if(err) console.log('err when payday id process : ', err);
          sndresult.payed = true;
          sndresult.save(err=>{
            if(err) res.status(500).json({ error: ' faild to update'});
          })
        })
        console.log(result);
        console.log('----------------updated------------------');
      });
    });
  }
  res.json({ message: 'saved successfully' });
});

// admin paying api END*************************

// admin paying api START*************************
gcUnitRoutes.get('/getpayed', function(req, res) {
  Payed.find({},(err,docs)=>{
    if(err) console.log(err);
    res.status(201).send(docs);
  })
});
gcUnitRoutes.put('/getpayed/:id', function(req, res) {
  Payed.findById(req.body._id, function(err, docs) {
    if (err) return res.status(500).json({ error: 'database failure' });
    if (!docs) return res.status(404).json({ error: 'docs not found' });

    if (req.body.comment) docs.comment = req.body.comment;  else if(req.body.comment ==null) docs.comment = '';
    
    docs.save(function(err) {
      if (err) res.status(500).json({ error: 'fail to updtae' });
      res.json({ message: 'updated successfully' });
    });
  });
});

gcUnitRoutes.delete('/getpayed/:id', function(req, res) {
  Payed.findByIdAndRemove(req.params.id, req.body, function(err, gcUnit) {
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log('successfully removed');
      res.json('Successfully removed');
    }
  });
});

// admin paying api END*************************

// counsel edit api Start *******************************
gcUnitRoutes.get('/counsel:id', function(req, res){
  /** let paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }
  let param = req.params.id;
  if(param){
    Counsel.paginate({저자: param},{page:paged, limit:10},(err,result)=>{
      if(err) console.log(err);
      res.json(result);
    })
  }*/
  let param = req.params.id;
  if(param){
    Counsel.find({저자: param}, (err,result)=>{
      if(err) console.log(err);
      res.json(result);
    })
  }
  
})
gcUnitRoutes.post('/counsel',function(req,res){
  let counsel = new Counsel(req.body.newdata);
  counsel.저자 = req.body.id;
  counsel._id = new mongoose.Types.ObjectId();
  counsel.save((err)=>{
    if(err){
      console.log(err);
      res.status(403);
    } else {
      res.status(201).json(counsel);
    }
  })
})
gcUnitRoutes.put('/counsel:id', function(req,res){
  Counsel.findById(req.body._id, (err,counsel)=>{
    if (err) return res.status(500).json({ error: 'database failure' });
    if (!counsel) return res.status(404).json({ error: 'counsel not found' });

    if(req.body.저자) counsel.저자 = req.body.저자;
    if(req.body.연월일) counsel.연월일 = req.body.연월일;
    if(req.body.담당자) counsel.담당자 = req.body.담당자;

    counsel.save((err)=>{
      if (err) res.status(500).json({ error: 'fail to updtae' });
      res.json({ message: 'updated successfully' });
    });
  });
})
gcUnitRoutes.delete('/counsel:id', function(req,res){
  Counsel.findByIdAndRemove(req.params.id, req.body, (err,gcUnit)=>{
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log('successfully removed');
      res.json('Successfully removed');
    }
  })
})
// counsel edit api End *******************************

// edition edit api Start *******************************
gcUnitRoutes.get('/edition:id', function(req, res){
  let paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }
  let param = req.params.id;
  if(param){
    Edition.paginate({바코드: param},{page:paged, limit:10},(err,result)=>{
      if(err) console.log(err);
      res.json(result);
    })
  }
})
gcUnitRoutes.post('/edition',function(req,res){
  let edition = new Edition(req.body.newdata);
  edition.바코드 = req.body.barcode;
  edition._id = new mongoose.Types.ObjectId();
  edition.save((err)=>{
    if(err){
      console.log(err);
      res.status(403);
    } else {
      res.status(201).json(edition);
    }
  })
})
gcUnitRoutes.put('/edition:id', function(req,res){
  Edition.findById(req.body._id, (err,edition)=>{
    if (err) return res.status(500).json({ error: 'database failure' });
    if (!edition) return res.status(404).json({ error: 'edition not found' });

    edition = req.body;

    edition.save((err)=>{
      if (err) res.status(500).json({ error: 'fail to updtae' });
      res.json({ message: 'updated successfully' });
    });
  });
})
gcUnitRoutes.delete('/edition:id', function(req,res){
  Edition.findByIdAndRemove(req.params.id, req.body, (err,gcUnit)=>{
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log('successfully removed');
      res.json('Successfully removed');
    }
  })
})
// edition edit api End *******************************

// edition edit api Start *******************************
gcUnitRoutes.get('/process:id', function(req, res){
  let paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }
  let param = req.params.id;
  if(param){
    Process.paginate({바코드: param},{page:paged, limit:10},(err,result)=>{
      if(err) console.log(err);
      res.json(result);
    })
  }
})
gcUnitRoutes.post('/process',function(req,res){
  let process = new Process(req.body.newdata);
  process.바코드 = req.body.barcode;
  process._id = new mongoose.Types.ObjectId();
  process.save((err)=>{
    if(err){
      console.log(err);
      res.status(403);
    } else {
      res.status(201).json(process);
    }
  })
})
gcUnitRoutes.put('/process:id', function(req,res){
  Process.findById(req.body._id, (err,process)=>{
    if (err) return res.status(500).json({ error: 'database failure' });
    if (!process) return res.status(404).json({ error: 'process not found' });

    process = req.body;

    process.save((err)=>{
      if (err) res.status(500).json({ error: 'fail to updtae' });
      res.json({ message: 'updated successfully' });
    });
  });
})
gcUnitRoutes.delete('/process:id', function(req,res){
  Process.findByIdAndRemove(req.params.id, req.body, (err,gcUnit)=>{
    if (err) {
      console.log(err);
      res.json(err);
    } else {
      console.log('successfully removed');
      res.json('Successfully removed');
    }
  })
})
// edition edit api End *******************************
gcUnitRoutes.get('/paychart', passport.authenticate('jwt', { session: false }),(req, res)=> {
    var token = getToken(req.headers);
    var user = req.user.저자;
    if (token) {
      Royalti.find({ 저자: new RegExp(user, 'i') }, (err, result)=> {
        
        res.json(result);
      });
    } else {
      return res.status(403).send({ success: false, msg: 'Unauthorized.' });
    }
  }
);

gcUnitRoutes.get('/recalc', (req,res)=>{
  Royalti.deleteMany()
  .then((result)=>{
    console.log('Royalti deleted')
    standardofprice()
  })
  .then((two)=>{
    res.status(201).send({success: true, msg: 'Royalti updated'});
  })
})

gcUnitRoutes.post('/bookofsomeone', (req,res)=>{
  let editor = req.body.저자;
  Bookcode.find({저자:editor},(err,docs)=>{
    if(err) console.log(err);
    res.send(docs)
  })
})

gcUnitRoutes.get('/superdmlwls', (req,res)=>{
  Editor.find({},(err,data)=>{
    if(err) console.log(err)
    data.forEach((datab)=>{
        Editor.findById(datab._id, (err,editor)=>{
            if(err) console.log(err);

            editor.id = datab.저자;
            if(datab.연락처_휴대전화){
              editor.pw = datab.연락처_휴대전화;
            }else{
              editor.pw = datab.저자;
            }
            
            editor.save();
        });
    })
    res.send('done')
})
})
module.exports = gcUnitRoutes;
