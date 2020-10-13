const wxpay = require('../../utils/pay.js')
const WXAPI = require('apifm-wxapi')
const app = getApp()
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js')
const UBT = require('../../utils/ubt.js')
const CONFIG = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: undefined,
    rechargeSendRules: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let recharge_amount_min = wx.getStorageSync('recharge_amount_min')
    if (!recharge_amount_min) {
      recharge_amount_min = 0;
    }
    this.setData({
      uid: wx.getStorageSync('uid'),
      recharge_amount_min: recharge_amount_min
    });
  },

  /**
     * 点击充值优惠的充值送
     */
  rechargeAmount: function (e) {
    var confine = e.currentTarget.dataset.confine;
    var amount = confine;
    this.setData({
      amount: amount
    });
    wxpay.wxpay('recharge', amount, 0, "/pages/my/index");
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
      const _this = this
      const order_hx_uids = wx.getStorageSync('order_hx_uids')
      this.setData({
        version: CONFIG.version,
        order_hx_uids
      })
      AUTH.checkHasLogined().then(isLogined => {
        this.setData({
          wxlogin: isLogined
        })
        if (isLogined) {
          _this.getUserApiInfo();
          _this.getUserAmount();
          // _this.orderStatistics();
        }
      })
    },
    getUserApiInfo: function () {
      var that = this;
      WXAPI.userDetail(wx.getStorageSync('token')).then(function (res) {
        if (res.code == 0) {
          let _data = {}
          _data.apiUserInfoMap = res.data
          if (res.data.base.mobile) {
            _data.userMobile = res.data.base.mobile
          }
          if (that.data.order_hx_uids && that.data.order_hx_uids.indexOf(res.data.base.id) != -1) {
            _data.canHX = true // 具有扫码核销的权限
          }
          that.setData(_data);
        }
      })
    },
    getUserAmount: function () {
      var that = this;
      var uid = wx.getStorageSync('uid');
      UBT.retrieveUBT(uid, 'score').then(function (res) {
        that.setData({
          balance: 0, // no cash balance for now
          freeze: res.data.frozen.toFixed(2),
          mubt: res.data && res.data.point ? res.data.point.toFixed(2) : 0
        });
      })
      UBT.retrieveUBT(uid, 'ubt').then(function (res) {
  
        var ubt = res.data && res.data.point ? res.data.point.toFixed(2) : 0
        that.setData({
          ubt: ubt,
          rmb: ubt * 7
        });
      })
    },
  bindSave: function (e) {
    const that = this;
    const amount = e.detail.value.amount;

    if (amount == "" || amount * 1 < 0) {
      wx.showModal({
        title: '错误',
        content: '请填写正确的充值金额',
        showCancel: false
      })
      return
    }
    if (amount * 1 < that.data.recharge_amount_min * 1) {
      wx.showModal({
        title: '错误',
        content: '单次充值金额至少' + that.data.recharge_amount_min + '元',
        showCancel: false
      })
      return
    }
    wxpay.wxpay('recharge', amount, 0, "/pages/my/index");
  }
})
