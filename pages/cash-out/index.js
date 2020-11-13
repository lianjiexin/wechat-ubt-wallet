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
      registerCode = wx.getStorageSync('registerCode');
    UBT.retrieveUBT(registerCode, 'ubt').then(function (res) {
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
      registerCode = wx.getStorageSync('registerCode');
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

    UBT.exchangeUBTtoScore(registerCode, Number(ubt), "rmb").then(res => {
      if (res.status == 0) {
        wx.showModal({
          content: '成功提现 ' + res.number + " RMB",
          showCancel: false,
          success(res) {
            // if (res.confirm) _self.init();
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
    _self.init();
  },
  // bindSave1(e) {
  //   const _self = this,
  //     isNumber = /^(0|[1-9][0-9]*)$/,
  //     token = wx.getStorageSync('token');
  //   let rmb = e.detail.value.rmb;
  //   rmb.replace(/\s+/g, "");

  //   if (!rmb || !isNumber.test(rmb)) {
  //     wx.showToast({
  //       title: !ubt ? '请输入提现金额' : '请输入正确金额',
  //       icon: 'none'
  //     })
  //     return
  //   }

  //   WXAPI.withDrawApply(token, rmb).then(res => {
  //     console.log("123", res);
  //   })

  // }
})