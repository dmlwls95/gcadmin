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
var Payed = require('../models/payed.js');
var Counsel = require('../models/counsel.js');
var Edition = require('../models/edition.js');
var Process = require('../models/process.js');
bnpanal = require('../services/services.js').bnpanal;
halfofyear = require('../services/services.js').halfofyear;
logging = require('../services/services.js').logging;
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

// Defined store route
gcUnitRoutes.get('/', function(req, res, next) {
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
        return halfofyear();
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
      { page: paged, limit: 10 },
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
    Editor.paginate({}, { page: paged, limit: 10 }, function(err, result) {
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

   editor = req.body;
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
      result = req.body
      result.save(function(err) {
        if (err) res.status(500).json({ error: 'fail to updtae' });
        res.json({ message: 'updated successfully' });
      });
    } else if (!result) {
      let editor = new Editor();
      editor = req.body;
      editor._id = new mongoose.Types.ObjectId();
      editor.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.json(editor);
        }
      });
    }
  });
});

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
      if (req.body.relday) result.신간일 = req.body.relday;
      if (req.body.from) result.발행처 = req.body.from;
      if (req.body.price) result.정가 = req.body.price;
      if (req.body.totalnumber) result.총재고 = req.body.totalnumber;
      if (req.body.homenumber) result.본사재고 = req.body.homenumber;
      if (req.body.genuinenumber) result.정품재고 = req.body.genuinenumber;
      if (req.body.refundnumber) result.반품재고 = req.body.refundnumber;
      result.save(function(err) {
        if (err) res.status(500).json({ error: 'fail to updtae' });
        res.json({ message: 'updated successfully' });
      });
    } else if (!result) {
      let book = new Bookcode();
      if (req.body.barcode) book.바코드 = req.body.barcode;
      if (req.body.bookcode) book.도서코드 = req.body.bookcode;
      if (req.body.bookname) book.도서명 = req.body.bookname;
      if (req.body.author) book.저자 = req.body.author;
      if (req.body.relday) book.신간일 = req.body.relday;
      if (req.body.from) book.발행처 = req.body.from;
      if (req.body.price) book.정가 = req.body.price;
      if (req.body.totalnumber) book.총재고 = req.body.totalnumber;
      if (req.body.homenumber) book.본사재고 = req.body.homenumber;
      if (req.body.genuinenumber) book.정품재고 = req.body.genuinenumber;
      if (req.body.refundnumber) book.반품재고 = req.body.refundnumber;
      book._id = new mongoose.Types.ObjectId();
      book.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          res.json(book);
        }
      });
    }
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
      res.json(err);
    } else {
      console.log('successfully removed');
      res.json('Successfully removed');
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
            매출부수: tmp[0].매출부수,
            매출금액: 0,
            본사이동부수: tmp[0].본사이동부수,
            증정부수: tmp[0].증정부수,
            반품부수: tmp[0].반품부수,
            반품금액: tmp[0].반품금액,
            폐기부수: tmp[0].폐기부수,
            현정품재고: tmp[0].현정품재고,
            현반품재고: tmp[0].현반품재고,
            순매출부수: tmp[0].순매출부수,
            순매출금액: tmp[0].순매출금액,
            신간일자: tmp[0].신간일자,
            ids: null
          };
          for (let i in tmp) {
            //매출은 매출끼리 합산
            if (tmp[i]) {
              restmp.매출금액 = restmp.매출금액 + tmp[i].매출금액;
            } else {
              restmp.매출금액 = restmp.매출금액 + 0;
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
    if (tmp[i].인세금액) payed.인세금액 = tmp[i].인세금액;
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
  var paged;
  if (req.query.page == null) {
    paged = 1;
  } else {
    paged = req.query.page;
  }
  var query = req.query;

  if (query.저자) {
    Payed.paginate(
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
  }else if(query.도서명){
    Payed.paginate(
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
  }
  else{
    Payed.paginate({}, { page: paged, limit: 10 }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        res.json(result);
      }
    });
  }
});

// admin paying api END*************************

// counsel edit api Start *******************************
gcUnitRoutes.get('/counsel:id', function(req, res){
  let paged;
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


module.exports = gcUnitRoutes;
