/* 
Include all utility functions for UBT
*/
const CONFIG = require('../config.js')

async function checkAndCreateUser(uid)
{
  retrieveUBT(uid).then(function (res){
  if(res.status == 0 && res.data == null){
    console.info('Create User for ' + uid );
     createUser(uid);   
     resolve(res);     
           }
  else{
             console.info("response date not null, the user should have been created");
             console.info(res); 
    }
   })
}

async function createUser(uid)
{
  var that = this;
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/increase', //建立新用户，缺省给10 point；
    data: {
        "cost": 1,
        "expireTime": "2025-10-24 15:34:46",
        "extra": {},
        "issueTime": "2005-12-25 15:34:46",
        "name": "Tom",
        "note": "this is a note",
        "orderNo": "string",
        "orderType": 0,
        "payType": 0,
        "point": 10,
        "seq": Math.round(Math.random() * 1000000),
        "sourceType": 0,
        "subUid": "",
        "tag": "string",
        "type": "score",
        "uid": uid
    },
    method: "POST",
    header: {
        "Content-Type": "application/json"  //post
    },
    complete: function( res ) {
        if( res == null || res.data == null ) {
            reject(new Error('网络请求失败'))
        }      
        that.setData( {
          data: res.data
      });
      
    },
    success: function(res) {
      console.info("Create User Success");
      console.info(res);
        if(res.data.status == 0){
            resolve(res)
        }
        else
        {
          reject(new Error(res));
        }
    }
  })
  })
}

async function retrieveUBT (uid)
{
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/getPoint', //检查该用户的UBT；
    data: {
        "type": "score",
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

        console.info ("Successfully Retrieve UBT ");
        resolve(res.data);
    }
  })
})
}




module.exports = {
  retrieveUBT:retrieveUBT,
  checkAndCreateUser: checkAndCreateUser,
  createUser: createUser
}