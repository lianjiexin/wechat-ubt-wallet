/* 
Include all utility functions for UBT
*/
const CONFIG = require('../config.js')

async function checkAndCreateUser(uid) {
  return new Promise((resolve, reject) => {
    retrieveUBT(uid, 'score').then(function (res) {
      if (res.status == 0 && res.data == null) {
        var ret = createAccount(uid, 10, 'score');
        resolve(ret);
      } else {
        resolve(res);
      }
    })
  })

}
async function exchangeScoreToUBT(uid, ubtAddress, score) {
  var ubt = 2 * score; // Assuming the exchange ratio is growth/score = 2
  return new Promise((resolve, reject) => {
    decreaseUBT(uid, score, 'score').
      then(increaseUBT(uid, ubtAddress, ubt, 'ubt')).
      then(function (res) {
        var ret = {
          'uid': uid,
          'score': score,
          'growth': ubt,
          'status': 0
        }
        resolve(ret);
      });
  })


}

async function retrieveUBT(uid, pointType) {
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://' + domain + '/ubt/point/getPoint', //检查该用户的UBT；
      data: {
        "type": pointType,
        "uid": uid
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }

      },
      success: function (res) {
        resolve(res.data);
      }
    })
  })
}

async function decreaseUBT(uid, point, pointType) {
  var that = this;
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://' + domain + '/ubt/point/decrease', //减少积分；
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
      complete: function (res) {
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }


      },
      success: function (res) {
        if (res.data.status == 0) {
          resolve(res.data)
        }
        else {
          reject(new Error(res));
        }
      }
    })
  })
}


async function increaseUBT(uid, ubtAddress, point, pointType) {
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://' + domain + '/ubt/point/increase', //增加积分；
      data: {
        "point": point,
        "seq": Math.round(Math.random() * 1000000),
        "name": ubtAddress,
        "type": pointType,
        "uid": uid
      },
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }

      },
      success: function (res) {

        if (res.data.status == 0) {
          resolve(res.data)
        }
        else {
          reject(new Error(res));
        }
      }
    })
  })
}

async function createAccount(uid, point, pointType) {
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://' + domain + '/ubt/point/create', //创建帐号；
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
      complete: function (res) {
        if (res == null || res.data == null) {
          reject(new Error('网络请求失败'))
        }

      },
      success: function (res) {

        if (res.data.status == 0) {
          resolve(res.data)
        }
        else {
          reject(new Error(res));
        }
      }
    })
  })
}


module.exports = {
  retrieveUBT: retrieveUBT,
  checkAndCreateUser: checkAndCreateUser,
  increaseUBT: increaseUBT,
  decreaseUBT: decreaseUBT,
  exchangeScoreToUBT: exchangeScoreToUBT
}