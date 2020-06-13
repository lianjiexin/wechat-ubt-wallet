/* 
Include all utility functions for UBT
*/
const CONFIG = require('../config.js')

async function checkAndCreateUser(uid)
{
  return new Promise((resolve, reject) => {
  retrieveUBT(uid,'score').then(function (res){
  if(res.status == 0 && res.data == null){
    console.info('Create User for ' + uid );
    increaseUBT (uid,10,'score')
    increaseUBT (uid,0,'growth')  //TODO: wrap into a transaction
    resolve(res);     
           }
  else{
        console.info("response not null, the user" + uid + "should have been created");
        reject ( new Error(res));
    }
   })
  })
   
}
async function exchangeScoreToGrowth(uid,score)
{
  var growth = 2 * score; // Assuming the exchange ratio is growth/score = 2
  return new Promise((resolve, reject) => {
  decreaseUBT(uid,score,'score').
  then(increaseUBT(uid,growth,'growth')).
  then(function (res){
    console.info ('User ' + uid + ' : exchange score ' + score + ' for growth ' + growth)
    var ret = { 'uid' :uid,
              'score':score,
              'growth':growth,
              'status':0
              }
    resolve(ret);
  });
})

  
}

async function retrieveUBT (uid, ubtType)
{
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/getPoint', //检查该用户的UBT；
    data: {
        "type": ubtType,
        "uid": uid
    },
    method: "GET",
    header: {
        "Content-Type": "application/json" 
    },
    complete: function( res ) {
        if( res == null || res.data == null) {
          console.error('网络请求失败')
          reject(new Error('网络请求失败'))
        }

    },
    success: function(res) {
        console.info ("Successfully Retrieve UBT for User: " + uid +', ubtType:' + ubtType);
        console.info(res);
        resolve(res.data);
    }
  })
})
}

async function decreaseUBT (uid,point,ubtType)
{
  var that = this;
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/decrease', //减少积分；
    data: {
      "extra": {},
      "name": "Tom",
      "note": "this is a note",
      "orderNo": "string",
      "orderType": 0,
      "payType": 0,
      "point": point,
      "seq": Math.round(Math.random() * 1000000),
      "sourceType": 0,
      "subUid": "",
      "tag": "string",
      "type": ubtType,
      "uid": uid
    },
    method: "POST",
    header: {
        "Content-Type": "application/json" 
    },
    complete: function( res ) {
        if( res == null || res.data == null) {
          console.error('网络请求失败')
          reject(new Error('网络请求失败'))
        }
        

    },
    success: function(res) {
      if(res.data.status == 0){
        console. info('Successfully decrease Point ' + point + 'for user ' + uid + ' ubtType: ' + ubtType);
        resolve(res.data)
    }
    else
    {
      reject(new Error(res));
    }
    }
  })
})
}

async function increaseUBT (uid,point,ubtType)
{
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/increase', //增加积分；
    data: {
      "extra": {},
      "name": "Tom",
      "note": "this is a note",
      "orderNo": "string",
      "orderType": 0,
      "payType": 0,
      "point": point,
      "seq": Math.round(Math.random() * 1000000),
      "sourceType": 0,
      "subUid": "",
      "tag": "string",
      "type": ubtType,
      "uid": uid
    },
    method: "POST",
    header: {
        "Content-Type": "application/json" 
    },
    complete: function( res ) {
        if( res == null || res.data == null) {
          console.error('网络请求失败')
          reject(new Error('网络请求失败'))
        }

    },
    success: function(res) {

      if(res.data.status == 0){
        console. info('Successfully increase Point ' + point + 'for user ' + uid + ' ubtType ' + ubtType);
        resolve(res.data)
    }
    else
    {
      reject(new Error(res));
    }
    }
  })
})
}


module.exports = {
  retrieveUBT:retrieveUBT,
  checkAndCreateUser: checkAndCreateUser,
  increaseUBT: increaseUBT,
  decreaseUBT: decreaseUBT,
  exchangeScoreToGrowth: exchangeScoreToGrowth
}