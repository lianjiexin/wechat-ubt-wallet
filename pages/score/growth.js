const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const UBT = require('../../utils/ubt.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    growth: 0.00,
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
        this.initData()
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
    UBT.retrieveUBT(uid, 'ubt').then(function (res) {
      if (res.status == 0) {
        _this.setData({
          growth: res.data.point.toFixed(2)
        });
      } else {
        wx.showToast({
          title: '获取UBT出错',
          icon: 'none'
        })
      }
    })
    // 读取积分明细
    /*
    WXAPI.growthLogs({
      token: token,
      page: 1,
      pageSize: 50
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          cashlogs: res.data.result
        })
      }
    })
    */
  },

  // exchangeMUBT() {
  //   wx.navigateTo({
  //     url: "/pages/score-excharge/growth"
  //   })
  // },

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

  async initData() {
    const uid = wx.getStorageSync('uid')
    var _this = this;
    UBT.retrieveUBT(uid, 'score').then(function (res) {
      if (res.status == 0) {
        _this.data.score = res.data.point;

      }
      else {
        wx.showToast({
          title: 'UBT',
          icon: 'none'
        })
      }
    })
    const res2 = await WXAPI.scoreDeductionRules(1);
    if (res2.code == 0) {
      this.data.deductionRules = res2.data
    }
    this.setData({
      score: this.data.score,
      deductionRules: this.data.deductionRules,
    })
  },
  async bindSave(e) {
    const score = e.detail.value.score;
    if (!score) {
      wx.showToast({
        title: '请输入UBT数量',
        icon: 'none'
      })
      return
    }
    const uid = wx.getStorageSync('uid')
    UBT.exchangeScoreToUBT(uid, score).then(function (res) {
      console.info(res);
      if (res.status == 0) {
        wx.showModal({
          title: '成功',
          content: '恭喜您，成功兑换' + res.growth + 'UBT',
          showCancel: false,
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
        return
      } else {
        wx.showToast({
          title: "兑换失败",
          icon: 'none'
        })
      }
    })
  },
  // cancelLogin() {
  //   this.setData({
  //     wxlogin: true
  //   })
  // },
  // processLogin(e) {
  //   if (!e.detail.userInfo) {
  //     wx.showToast({
  //       title: '已取消',
  //       icon: 'none',
  //     })
  //     return;
  //   }
  //   AUTH.register(this);
  // },
})