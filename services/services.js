const Bookcode = require('../models/bookcode.js');
const Contract = require('../models/contractdb.js');
const Editor = require('../models/editor.js');
const Payday = require('../models/payday.js');
const mongoose = require('mongoose');
const Royalti = require('../models/royalti.js');
mongoose.Promise = require('bluebird');
function logging(){
    Editor.find({},(err,data)=>{
        if(err) console.log(err)

        data.forEach((datab)=>{
            Editor.findById(datab._id, (err,editor)=>{
                if(err) console.log(err);

                editor.id = datab.저자;
                editor.pw = datab._id;
                editor.save();
            });
        })
        console.log('saved')
    })
}

function bnpanal(){
    Contract.find({})
    .then(function(data){
        //console.log(data);
        data.forEach(function(dataa){
            Payday.update({도서명: dataa.도서명},{저자: dataa.저자},{multi:true},function(err,docs){
                if(err){
                    console.log("Something wrong when updating data!");
                }
            });
        })
    }).catch(function(err){
        console.log(err);
    });
    return new Promise(function(resolved,rejected){
        setTimeout(
              function(){
                    resolved('done');
              },2000);
   });
   
}

function halfofyear(){
    
    Contract.find({}).exec(function(err,data){
        data.forEach(function(dataa){
            Payday.find({$and: [{저자: { $regex: '.*' + dataa.저자 + '.*'}, 도서명: dataa.도서명}]}).exec(function(err,result){
                if(err) console.log(err);
                console.log(result);
                result.forEach(function(datab){
                    
                    let royalti = new Royalti();
                    royalti._id = new mongoose.Types.ObjectId();
                    royalti.일자 = datab.일자;
                    royalti.저자 = dataa.저자;
                    royalti.도서명 = datab.도서명;
                    royalti.서점명 = datab.서점명;
                    royalti.인세금액 = (datab.순매출금액*dataa.인세율) / 100;
                    royalti.payed = false;
                    
                    royalti.save(function(err){
                        if(err) console.log(err);
                    })
                    
                })
                
            })
        })
    })
    
}
function calcroyalti(){
    Bookcode.find({}).exec((err,data)=>{
        data.forEach((dataa)=>{
            Payday.find({$and: [{저자:dataa.저자}, {바코드:dataa.바코드}]}).exec((err,result)=>{
                if(err) console.log(err);
                result.forEach((datab)=>{
                    Editor.find({저자:dataa.저자}).exec((err,datac)=>{
                        let royalti = new Royalti();
                        royalti._id = new mongoose.Types.ObjectId();
                        if(datac[0].은행) royalti.은행 = datac[0].은행; else royalti.은행 = null
                        if(datac[0].계좌번호) royalti.계좌번호 = datac[0].계좌번호; else royalti.계좌번호 = null
                        if(datac[0].예금주) royalti.예금주 = datac[0].예금주; else royalti.예금주 = null
                        if(datac[0].연락처_휴대전화) royalti.연락처 = datac[0].연락처_휴대전화; else royalti.연락처 = null
                        royalti.일자 = datab.일자;
                        royalti.저자 = dataa.저자;
                        royalti.도서명 = datab.도서명;
                        royalti.서점명 = datab.서점명;
                        royalti.인세금액 = (datab.순매출금액*dataa.인세율) / 100;
                        royalti.payed = false;
                        royalti.save(function(err){
                            if(err) console.log(err);
                        })
                    })
                    
                })
            })
        })
    })
}

module.exports = {
    logging: logging,
    bnpanal: bnpanal,
    halfofyear :halfofyear,
    calcroyalti: calcroyalti
};