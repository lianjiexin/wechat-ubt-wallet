const app = getApp()
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
// const TOOLS = require('../../utils/tools.js')
const UBT = require('../../utils/ubt.js')

Page({
  data: {
    wxlogin: true,
    wxloginState: false,
    wxBindingState: false,
    balance: 0.00,
    freeze: 0,
    mubt: 0,
    ubt: 0,
    rmb: 0
  },
  onLoad() {
  },
  onShow() {
    const _this = this,
      order_hx_uids = wx.getStorageSync('order_hx_uids');
    this.setData({
      version: CONFIG.version,
      order_hx_uids
    })
    AUTH.checkHasLogined().then(isLogined => {
      this.setWxLoginState(isLogined);
      if (isLogined) {
        this.setData({
          wxloginState: isLogined
        })
        _this.getIsRegistryCode();
        _this.getUserApiInfo();
        _this.getUserAmount();
      }
    })
  },

  /* 查询用户注册码是否绑定 */
  async getIsRegistryCode() {
    const registerCode = wx.getStorageSync('uid'),
      data = await UBT.getUidRegistryByUid(registerCode);
    this.setData({
      wxBindingState: data == null ? false : true
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
    const that = this,
      uid = wx.getStorageSync('uid');
    // UBT.retrieveUBT(uid, 'score').then(function (res) {
    //   that.setData({
    //     balance: 0, // no cash balance for now
    //     freeze: res.data.frozen.toFixed(2),
    //     mubt: res.data && res.data.point ? res.data.point.toFixed(2) : 0
    //   });
    // })
    UBT.retrieveUBT(uid, 'ubt').then(function (res) {
      var ubt = res.data && res.data.point ? res.data.point.toFixed(2) : 0
      that.setData({
        ubt: ubt,
        rmb: ubt * 7
      });
    })
  },
  /**
   * 修改登录状态
   * @param {Boolean} state [true/false]
   */
  setWxLoginState(e) {
    const state = e.currentTarget ? e.currentTarget.dataset.state : e
    this.setData({
      wxlogin: state,
    })
  },
  /**
   * 微信授权登录
   * @param {*} e 
   */
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none',
      })
      return;
    }
    AUTH.register(this);
  },
  /**
   * 登出
   */
  loginOut() {
    AUTH.loginOut()
    wx.reLaunch({
      url: '/pages/my/index'
    })
  },
  /**
   * 清除缓存
   */
  // clearStorage() {
  //   wx.clearStorageSync()
  //   wx.showToast({
  //     title: '已清除',
  //     icon: 'success'
  //   })
  // },
  /**
   * 关于我们
   */
  aboutUs: function () {
    wx.showModal({
      title: '关于我们',
      content: '优贝，基于区块链智能合约的药品权证结算分发系统',
      showCancel: false
    })
  },
})