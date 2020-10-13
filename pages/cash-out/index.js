const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const UBT = require('../../utils/ubt.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: undefined,
    ubt: "",
    maxUbt: 0,
    rmb: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init()
  },

  // 初始化
  init() {
    const _self = this,
      uid = wx.getStorageSync('uid');
    UBT.retrieveUBT(uid, 'ubt').then(function (res) {
      const ubt = res.data && res.data.point ? res.data.point : 0
      _self.setData({
        maxUbt: ubt,
        rmb: ubt * 7,
        ubt: ""
      });
    })
  },

  bindSave: function (e) {
    const _self = this,
      isNumber = /^(0|[1-9][0-9]*)$/,
      uid = wx.getStorageSync('uid');
    let ubt = e.detail.value.amount;
    ubt.replace(/\s+/g, "");
    if (!ubt || !isNumber.test(ubt)) {
      wx.showToast({
        title: !ubt ? '请输入ubt数量' : '请输入正确数量',
        icon: 'none'
      })
      return
    }

    if (Number(ubt) > _self.data.maxUbt) {
      wx.showToast({
        title: '超出持有额',
        icon: 'none'
      })
      return
    }

    UBT.exchangeUBTtoScore(uid, Number(ubt), "rmb").then(res => {
      if (res.status == 0) {
        wx.showModal({
          title: '成功',
          content: '恭喜您，成功兑换' + res.number + "/rmb",
          showCancel: false,
          success(res) {
            if (res.confirm) _self.init();
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
})