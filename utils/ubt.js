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

/**
 * 其他权证兑换ubt，暂时没有rmb充值
 * @param {String} uid 
 * @param {Number} number 
 * @param {String} type 
 */
function exchangeScoreToUBT(uid, number, type) {
  const ubt = 2 * number;
  return new Promise((resolve, reject) => {
    const decreaseParam = createParams(uid, number, type),
      increaseParam = createParams(uid, ubt, "ubt");
    decreaseUBT(decreaseParam).
      then(increaseUBT(increaseParam)).
      then(function (res) {
        var ret = {
          'uid': uid,
          'number': number,
          'ubt': ubt,
          'status': 0
        }
        resolve(ret);
      });
  })

}

/**
 * ubt兑换其他权证或rmb
 * @param {String} uid 
 * @param {Number} ubt 
 * @param {String} type 
 */
function exchangeUBTtoScore(uid, ubt, type) {
  let number = type == "rmb" ? ubt * 7 : ubt / 2;
  return new Promise((resolve, reject) => {
    const decreaseParam = createParams(uid, ubt, "ubt"),
      increaseParam = createParams(uid, number, type);
    decreaseUBT(decreaseParam).
      then(increaseUBT(increaseParam)).
      then(function (res) {
        const ret = {
          'uid': uid,
          'number': number,
          'ubt': ubt,
          'status': 0
        }
        resolve(ret);
      });
  })

}

/**
 * 生成参数
 * @param {String} uid 
 * @param {Number} point 
 * @param {String} type 
 * @return {Object}
 */
function createParams(uid, point, type) {
  return {
    "point": point,
    "seq": Math.round(Math.random() * 1000000),
    "type": type,
    "uid": uid
  }
}

/**
 * 减少权证或ubt
 * @param {Object} params 
 */
function decreaseUBT(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.ubtDomain}/ubt/point/decrease`,
      data: params,
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
 * 增加权证、ubt或rmb
 * @param {Object} params 
 */
function increaseUBT(params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.ubtDomain}/ubt/point/increase`, //增加积分；
      data: params,
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
// async function createAccount(uid, point, pointType) {
//   var domain = CONFIG.ubtDomain
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: domain + '/ubt/point/create', //创建帐号；
//       data: {
//         "point": point,
//         "seq": Math.round(Math.random() * 1000000),
//         "type": pointType,
//         "uid": uid
//       },
//       method: "POST",
//       header: {
//         "Content-Type": "application/json"
//       },
//       complete: function (res) {
//         if (res == null || res.data == null) {
//           console.error('网络请求失败')
//           reject(new Error('网络请求失败'))
//         }
//       },
//       success: function (res) {
//         if (res.data.status == 0) {
//           resolve(res.data)
//         }
//         else {
//           reject(new Error(res));
//         }
//       }
//     })
//   })
// }

/**
 * 验证用户是否绑定注册码
 * @param {Strng} code 
 */
function getUidRegistryByUid(code) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.ubtDomain}/ubt/point/getUidRegistryByUid`,
      data: {
        uid: code
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

function getListPointRecord(uid) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${CONFIG.ubtDomain}/ubt/point/listPointRecord`,
      data: {
        type: "ubt",
        uid: uid
      },
      method: "POST",
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
  getUidRegistryByUid: getUidRegistryByUid,
  registerUid: registerUid,
  deregisterUid: deregisterUid,
  getListPointRecord: getListPointRecord
}
