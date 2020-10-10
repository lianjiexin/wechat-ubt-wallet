const WXAPI = require('apifm-wxapi')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp();
Page({
  data: {
    banners: [],
    swiperMaxNumber: 0,
    swiperCurrent: 0
  },
  onLoad: function () {
    const _this = this
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    const app_show_pic_version = wx.getStorageSync('app_show_pic_version')
    if (app_show_pic_version && app_show_pic_version == CONFIG.version) {
      if (CONFIG.shopMod) {
        wx.redirectTo({
          // url: '/pages/shop/select',
          url: '/pages/my/index',
        });
      } else {
        // wx.switchTab({
        wx.redirectTo({
          // url: '/pages/index/index',
          url: '/pages/my/index',
        });
      }
    } else {
      // 展示启动页
      WXAPI.banners({
        type: 'app'
      }).then(function (res) {
        if (res.code == 700) {
          if (CONFIG.shopMod) {
            wx.redirectTo({
              // url: '/pages/shop/select',
              url: '/pages/my/index',
            });
          } else {
            // wx.switchTab({
            wx.redirectTo({
              // url: '/pages/index/index',
              url: '/pages/my/index',
            });
          }
        } else {
          _this.setData({
            banners: res.data,
            swiperMaxNumber: res.data.length
          });
        }
      }).catch(function (e) {
        if (CONFIG.shopMod) {
          wx.redirectTo({
            // url: '/pages/shop/select',
            url: '/pages/my/index',
          });
        } else {
          // wx.switchTab({
          wx.redirectTo({
            // url: '/pages/index/index',
            url: '/pages/my/index',
          });
        }
      })
    }
  },
  onShow: function () {

  },
  swiperchange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  goToIndex: function (e) {
    if (app.globalData.isConnected) {
      wx.setStorage({
        key: 'app_show_pic_version',
        data: CONFIG.version
      })
      if (CONFIG.shopMod) {
        wx.redirectTo({
          // url: '/pages/shop/select',
          url: '/pages/my/index',
        });
      } else {
        // wx.switchTab({
        wx.redirectTo({
          // url: '/pages/index/index',
          url: '/pages/my/index',
        });
      }
    } else {
      wx.showToast({
        title: '当前无网络',
        icon: 'none',
      })
    }
  },
  imgClick() {
    if (this.data.swiperCurrent + 1 != this.data.swiperMaxNumber) {
      wx.showToast({
        title: '左滑进入',
        icon: 'none',
      })
    }
  }
});