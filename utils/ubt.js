/* 
Include all utility functions for UBT
*/
const CONFIG = require('../config.js')


async function checkAndCreateUser (uid)
{
  console.info("checkAndCreateUser for " + uid)
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/getPoint', //检查该用户的积分；
    data: {
        "type": "score",
        "uid": uid
    },
    method: "GET",
    header: {
        "Content-Type": "application/json"  //post
    },
    complete: function( res ) {
      /*  
      this.setData( {
            data: res.data
        });
      */
     console.info('function complete');
     console.info(res)
        if( res == null ) {
            reject(new Error('网络请求失败'))
            console.error('网络请求失败')
        }
    },
    fail: function(res)
    {
      console.info('function fail');
      console.info(res);
    },
    success: function(res) {
      console.info('function success, check the response below');
    
        if(res.data.status == 0 && res.data.data == null){
          console.info('Create User for ' + uid );
          createUser(uid);   
          resolve(res);     
        }
        else{
          console.info("response date not null, the user should have been created");
          console.info(res); 
        }
    }
  })
})

}

async function createUser(uid)
{
  var that = this;
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://' + domain +'/ubt/point/getPoint', //检查该用户的积分；
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
      
        that.setData( {
            data: res.data
        });
        
        if( res == null || res.data == null ) {
            reject(new Error('网络请求失败'))
        }
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
  return new Promise((resolve, reject) => {
  wx.request({
    url: 'http://192.168.1.44:8080/ubt/point/getPoint', //检查该用户的UBT；
    data: {
        "type": "score",
        "uid": uid
    },
    method: "GET",
    header: {
        "Content-Type": "application/json" 
    },
    complete: function( res ) {
        if( res == null ) {
          console.error('网络请求失败')
          reject(new Error('网络请求失败'))
        }
    },
    success: function(res) {
        if(res.data.status == 0 && res.data.data == null){
          reject(new Error(res));
        }
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