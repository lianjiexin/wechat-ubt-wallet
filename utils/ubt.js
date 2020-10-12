/* 
Include all utility functions for UBT
*/
const CONFIG = require('../config.js')

async function checkUser(uid) {
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
    wx.request({
      url: domain + '/ubt/point/getUbtAccount', //检查该用户的UBT；
      data: {
        "subUid": "",
        "uid": uid
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败')
          reject(new Error('网络请求失败'))
        }
      },
      success: function (res) {
        if (res.data.data == null) {
          resolve(res.data.data);
        } else {
          resolve(res.data.data);
        }
      }
    })
  })

}

async function exchangeScoreToUBT(uid, mubt) {
  var ubt = 2 * mubt; // Assuming the exchange ratio is ubt/score = 2
  return new Promise((resolve, reject) => {

    var decreaseParam = createScoreParam(uid, mubt);
    var increaseParam = createUBTParam(uid, ubt);

    decreaseUBT(decreaseParam).
      then(increaseUBT(increaseParam)).
      then(function (res) {
        var ret = {
          'uid': uid,
          'mubt': mubt,
          'ubt': ubt,
          'status': 0
        }
        resolve(ret);
      });
  })

}

async function exchangeUBTtoScore(uid, ubt) {
  var mubt = ubt / 2; // Assuming the exchange ratio is score/ubt = 0.5
  return new Promise((resolve, reject) => {

    var decreaseParam = createUBTParam(uid, ubt);
    var increaseParam = createScoreParam(uid, mubt);

    decreaseUBT(decreaseParam).
      then(increaseUBT(increaseParam)).
      then(function (res) {
        var ret = {
          'uid': uid,
          'mubt': mubt,
          'ubt': ubt,
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
      url: domain + '/ubt/point/getPoint', //检查该用户的UBT；
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
          console.error('网络请求失败')
          reject(new Error('网络请求失败'))
        }

      },
      success: function (res) {
        resolve(res.data);
      }
    })
  })
}
function createScoreParam(uid, point) {
  var ret = {
    "point": point,
    "seq": Math.round(Math.random() * 1000000),
    "type": 'score',
    "uid": uid
  }
  return ret
}
function createUBTParam(uid, point) {
  var ret = {
    "point": point,
    "seq": Math.round(Math.random() * 1000000),
    "type": 'ubt',
    "uid": uid
  }
  return ret;
}
async function decreaseUBT(requestParam) {
  var that = this;
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
    wx.request({
      url: domain + '/ubt/point/decrease', //减少积分；
      data: requestParam,
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败')
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


async function increaseUBT(requestParam) {

  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
    wx.request({
      url: domain + '/ubt/point/increase', //增加积分；
      data: requestParam,
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败')
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

/* this function isn't used now */
async function createAccount(uid, point, pointType) {
  var domain = CONFIG.ubtDomain
  return new Promise((resolve, reject) => {
    wx.request({
      url: domain + '/ubt/point/create', //创建帐号；
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
          console.error('网络请求失败')
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

/**
 * 验证用户是否绑定注册码
 * @param {Strng} registerCode 
 */
function getUidRegistryByUid(registerCode) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.ubtDomain}/ubt/point/getUidRegistryByUid`,
      data: {
        uid: registerCode
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败')
        }
      },
      success: function (res) {
        resolve(res.data.data);
      }
    })
  })
}

/**
 * 绑定注册码
 * @param {Object} params 
 */
function registerUid(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.ubtDomain}/ubt/point/registerUid`,
      data: {
        password: params.password,
        registerCode: params.registerCode,
        uid: params.uid
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败')
          reject(new Error('网络请求失败'))
        }
      },
      success: function (res) {
        switch (res.data.status) {
          case 0:
            wx.showToast({
              title: '注册码绑定成功',
              icon: 'none'
            })
            resolve(true)
            break;
          case -1210:
            wx.showToast({
              title: res.data.error,
              icon: 'none'
            })
            resolve(true)
            break;
          default:
            wx.showToast({
              title: res.data.error,
              icon: 'none'
            })
            resolve(false);
        }
      }
    })
  })
}


/**
 * 解绑注册码
 * @param {Object} params 
 */
function deregisterUid(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.ubtDomain}/ubt/point/deregisterUid`,
      data: {
        password: params.password,
        registerCode: params.registerCode,
        uid: params.uid
      },
      method: "GET",
      header: {
        "Content-Type": "application/json"
      },
      complete: function (res) {
        if (res == null || res.data == null) {
          console.error('网络请求失败')
          reject(new Error('网络请求失败'))
        }
      },
      success: function (res) {
        switch (res.data.status) {
          case 0:
            wx.showToast({
              title: '注册码解绑成功',
              icon: 'none'
            })
            resolve(true)
            break;
          case -1210:
            wx.showToast({
              title: res.data.error,
              icon: 'none'
            })
            resolve(true)
            break;
          default:
            wx.showToast({
              title: res.data.error,
              icon: 'none'
            })
            resolve(false);
        }
      }
    })
  })
}


module.exports = {
  retrieveUBT: retrieveUBT,
  checkUser: checkUser,
  increaseUBT: increaseUBT,
  decreaseUBT: decreaseUBT,
  exchangeScoreToUBT: exchangeScoreToUBT,
  exchangeUBTtoScore: exchangeUBTtoScore,
  createScoreParam: createScoreParam,
  createUBTParam: createUBTParam,
  getUidRegistryByUid: getUidRegistryByUid,
  registerUid: registerUid,
  deregisterUid: deregisterUid
}
