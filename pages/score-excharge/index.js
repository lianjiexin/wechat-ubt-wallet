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
    number: "",
    maxNumber: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type,
      name: options.name
    })
  },

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
    this.setData({
      ubt: "",
      number: ""
    })
    UBT.retrieveUBT(uid, 'ubt').then(function (res) {
      _self.setData({
        maxUbt: res.data && res.data.point ? res.data.point : 0
      });
    })
    UBT.retrieveUBT(uid, this.data.type).then(function (res) {
      _self.setData({
        maxNumber: res.data && res.data.point ? res.data.point : 0
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

    UBT.exchangeUBTtoScore(uid, Number(ubt), _self.data.type).then(res => {
      if (res.status == 0) {
        wx.showModal({
          title: '成功',
          content: '恭喜您，成功兑换' + res.number + 'MUBT',
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

  bindSave1(e) {
    const _self = this,
      isNumber = /^(0|[1-9][0-9]*)$/,
      uid = wx.getStorageSync('uid');
    let number = e.detail.value.score;
    number.replace(/\s+/g, "");
    if (!number || !isNumber.test(number)) {
      wx.showToast({
        title: !number ? '请输入数量' : '请输入正确数量',
        icon: 'none'
      })
      return
    }
    if (Number(number) > _self.data.maxNumber) {
      wx.showToast({
        title: '超出持有额',
        icon: 'none'
      })
      return
    }
    UBT.exchangeScoreToUBT(uid, Number(number), _self.data.type).then(res => {
      if (res.status == 0) {
        wx.showModal({
          title: '成功',
          content: '恭喜您，成功兑换' + res.ubt + 'UBT',
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