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
    /*Payday.find().exec(function(err,data){
        data.forEach(function(dataa){ // data는 모든 매출데이터 dataa는 한줄
            
            let royalti = new Royalti();
            royalti._id = new mongoose.Types.ObjectId();
            royalti.일자 = Date.now();
            royalti.저자 = dataa.저자;
            royalti.도서명 = dataa.도서명;
            royalti.서점명 = dataa.서점명;
            royalti.인세금액 = paydata.매출금액 / dataa.인세율;
            royalti.save(function(err){
                if(err) console.log(err);

        
    })
        })
    })*/
    /*Payday.find().exec(function(err1,data){
        data.forEach(function(dataa){
            Contract.find({저자: { $regex: '.*' + dataa.저자 + '.*'}}).exec(function(err2,result){
                    result.forEach(function(datab){
                        let royalti = new Royalti();
                        royalti._id = new mongoose.Types.ObjectId();
                        royalti.일자 = dataa.일자;
                        royalti.저자 = datab.저자;
                        royalti.도서명 = dataa.도서명;
                        royalti.서점명 = dataa.서점명;
                        royalti.인세금액 = (dataa.매출금액*datab.인세율) / 100;
                        //console.log(royalti);
                        royalti.save(function(err){
                            if(err) console.log(err);
                        })
                    })
            })
        })
    });*/
    
    Contract.find({}).exec(function(err,data){
        data.forEach(function(dataa){
            Payday.find({$and: [{저자: { $regex: '.*' + dataa.저자 + '.*'}, 도서명: dataa.도서명}]}).exec(function(err,result){
                if(err) console.log(err);
                console.log(result);
                result.forEach(function(datab){
                    
                    let royalti = new Royalti();
                    royalti._id = new mongoose.Types.ObjectId();
                    let tmpdate = datab.일자;
                    let year = tmpdate.substr(0,4);
                    let month = tmpdate.substr(4,2);
                    let day = tmpdate.substr(6,2);
                    let tdate = new Date(year, month-1, day); 
                    tdate.setDate(tdate.getDate()+1);
                    royalti.일자 = tdate;
                    royalti.저자 = dataa.저자;
                    royalti.도서명 = datab.도서명;
                    royalti.서점명 = datab.서점명;
                    royalti.인세금액 = (datab.매출금액*dataa.인세율) / 100;
                    royalti.payed = false;
                    
                    royalti.save(function(err){
                        if(err) console.log(err);
                    })
                    
                })
                
            })
        })
    })
    
}

module.exports = {
    logging: logging,
    bnpanal: bnpanal,
    halfofyear :halfofyear
};