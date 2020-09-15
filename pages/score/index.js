const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const UBT = require('../../utils/ubt.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0.00,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    cashlogs: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    AUTH.checkHasLogined().then(isLogined => {
      if (isLogined) {
        this.doneShow();
      } else {
        wx.showModal({
          title: '提示',
          content: '本次操作需要您的登录授权',
          cancelText: '暂不登录',
          confirmText: '前往登录',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/my/index"
              })
            } else {
              wx.navigateBack()
            }
          }
        })
      }
    })
  },
  doneShow: function () {
    const _this = this
    const uid = wx.getStorageSync('uid')
    UBT.retrieveUBT(uid, 'score').then(function (res) {

      if (res.status == 0) {
        _this.setData({
          balance: 0,
          freeze: res.data.frozen.toFixed(2),
          totleConsumed: res.data.used.toFixed(2),
          score: res.data.point.toFixed(2)
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
    // 读取积分明细

    //积分明细暂时不显示
    // WXAPI.scoreLogs({
    //   token: token,
    //   page: 1,
    //   pageSize: 50
    // }).then(res => {
    //   if (res.code == 0) {
    //     _this.setData({
    //       cashlogs: res.data.result
    //     })
    //   }
    // })
  },
  // recharge: function (e) {
  //   wx.navigateTo({
  //     url: "/pages/recharge/index"
  //   })
  // },
  // withdraw: function (e) {
  //   wx.navigateTo({
  //     url: "/pages/withdraw/index"
  //   })
  // },

  bindSave: function(e) {
    var that = this;
    var amount = e.detail.value.amount;

    if (amount == "") {
      wx.showModal({
        title: '错误',
        content: '请填写正确的券号',
        showCancel: false
      })
      return
    }
    WXAPI.scoreExchange(wx.getStorageSync('token'), amount).then(function(res) {
      if (res.code == 700) {
        wx.showModal({
          title: '错误',
          content: '券号不正确',
          showCancel: false
        })
        return
      }
      if (res.code == 0) {
        wx.showModal({
          title: '成功',
          content: '恭喜您，成功兑换 ' + res.data.score + ' MUBT',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              that.bindCancel();
            }
          }
        })
      } else {
        wx.showModal({
          title: '错误',
          content: res.data.msg,
          showCancel: false
        })
      }
    })
  }

})