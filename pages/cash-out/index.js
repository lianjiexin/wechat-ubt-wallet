const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const UBT = require('../../utils/ubt.js')
const PAY = require('../../utils/pay.js')

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
      isDouble = /^\d+(\.\d+)?$/,
      registerCode = wx.getStorageSync('registerCode'),
      openId = wx.getStorageSync('openid');
    let ubt = e.detail.value.amount;
    ubt.replace(/\s+/g, "");
    if (!ubt || !isDouble.test(ubt)) {
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

    PAY.wxWithdrawRmb(registerCode, Number(ubt),openId).then(res => {
      console.info(res);
      if (res.status == 0) {
        if(res.data.result_code == 'SUCCESS') {
          wx.showModal({
            content: '成功提现 ' + Number(ubt) + " UBT",
            showCancel: false,
            success(res) {
              // if (res.confirm) _self.init();
            }
          })
          return
        }else {// 错误
          wx.showModal({
            title: '提现失败',
            content: res.data.return_msg,
            showCancel: false,
            success(res) {
              // if (res.confirm) _self.init();
            }
          })
          return
        }
      } else {
        wx.showModal({
          title: '提现失败.',
          content:' 错误码：' + res.status + '.\r\n' + res.error,
          showCancel: false,
          success(res) {
            // if (res.confirm) _self.init();
          }
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