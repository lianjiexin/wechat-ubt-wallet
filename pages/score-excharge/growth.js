const app = getApp()
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const UBT = require('../../utils/ubt.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxlogin: true,
    score: 0,
    uid: undefined
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
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.initData()
      }
    })
  },
  async initData(){
    const uid = wx.getStorageSync('uid')
    var _this = this;
    UBT.retrieveUBT(uid,'score').then(function (res){
    if (res.status == 0) {
      _this.data.score = res.data.point;
      
    }
    else {
      wx.showToast({
        title: 'MUBT',
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
        title: '请输入MUBT数量',
        icon: 'none'
      })
      return
    }
    const uid = wx.getStorageSync('uid')
    console.info ("exchange score for ubt: uid :" + uid );
    UBT.exchangeScoreToUBT(uid,score).then(function (res) {
      console.info(res);
    if (res.status == 0) {
      wx.showModal({
        title: '成功',
        content: '恭喜您，成功兑换'+ res.growth +'UBT',
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
    }})
  },
  cancelLogin() {
    this.setData({
      wxlogin: true
    })
  },
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
})