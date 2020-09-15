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
    var ret = createAccount(uid,10,'score');
 
    resolve(ret);     // to-be tested
           }
  else{

        console.info("response not null, the user" + uid + "should have been created");
        //reject ( new Error(res));
        console.info(res);
        resolve(res); 
    }
   })
  })
   
}
async function exchangeScoreToUBT(uid,ubtAddress, score)
{
  var ubt = 2 * score; // Assuming the exchange ratio is ubt/score = 2
  return new Promise((resolve, reject) => {
  
    var decreaseParam = createScoreParam(uid,score,'score');
    var increaseParam = createUBTParam(uid,ubtAddress,ubt);

  decreaseUBT(decreaseParam).
  then(increaseUBT(increaseParam)).
  then(function (res){
    console.info ('User ' + uid + ' : exchange score ' + score + ' for ubt: ' + ubt)
    var ret = { 'uid' :uid,
              'score':score,
              'growth':ubt,
              'status':0
              }
    resolve(ret);
  });
})

}

async function exchangeUBTtoScore(uid,ubtAddress, ubt)
{
  var score = ubt / 2; // Assuming the exchange ratio is score/ubt = 0.5
  return new Promise((resolve, reject) => {

    var decreaseParam = createUBTParam(uid,ubtAddress,ubt);
    var increaseParam = createScoreParam(uid,score,'score');
    
  decreaseUBT(decreaseParam).
  then(increaseUBT(increaseParam)).
  then(function (res){
    console.info ('User ' + uid + ' : exchange UBT ' + ubt + ' for score: ' + score)
    var ret = { 'uid' :uid,
              'score':score,
              'growth':ubt,
              'status':0
              }
    resolve(ret);
    });
  })

}
async function retrieveUBT (uid,pointType)
{
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/getPoint', //检查该用户的UBT；
    data: {
        "type": pointType,
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
        console.info ("Successfully Retrieve UBT for User: " + uid +', pointType:' + pointType);
        console.info(res);
        resolve(res.data);
    }
  })
})
}
function createScoreParam(uid,point,pointType)
{
  var ret =   {
    "point": point,
    "seq": Math.round(Math.random() * 1000000),
    "type": pointType,
    "uid": uid
  }
  return ret
}
function createUBTParam(uid,ubtAddress,point)
{
  var ret =   {
    "point": point,
    "seq": Math.round(Math.random() * 1000000),
    "name" :ubtAddress,
    "type": 'ubt',
    "uid": uid
  }
  return ret;
}
async function decreaseUBT (requestParam)
{
  console.info ("DecreaseUBT");
  console.info(requestParam);
  var that = this;
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/decrease', //减少积分；
    data: requestParam,
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
        console.info('Successfully decrease Point ' );
        console.info(requestParam);
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


async function increaseUBT (requestParam)
{
  console.info ("IncreaseUBT");
  console.info(requestParam);

  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/increase', //增加积分；
    data: requestParam,
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
        console. info('Successfully increase Point ' + point + 'for user ' + uid + ' pointType ' + pointType);
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

async function createAccount (uid,point,pointType)
{
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/create', //创建帐号；
    data: {
      "point": point,
      "seq": Math.round(Math.random() * 1000000),
      "type": pointType,
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
        console. info('Successfully Create Account for user: ' + uid + ', pointType: ' + pointType);
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
  exchangeScoreToUBT: exchangeScoreToUBT,
  createScoreParam: createScoreParam,
  createUBTParam: createUBTParam
}
