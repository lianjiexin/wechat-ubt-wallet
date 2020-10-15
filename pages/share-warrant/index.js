const app = getApp()
const CONFIG = require('../../config.js')
const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
const TOOLS = require('../../utils/tools.js')
const UBT = require('../../utils/ubt.js')

Page({
  data: {
    ubt: 0,
    rmb: 0,
    shareWarrantData: [{
      name: "恒瑞医药权证",
      type: "mubt",
      number: 0,
      ratio: 2
    }, {
      name: "早讯矿业权证",
      type: "tubt",
      number: 0,
      ratio: 2
    }]
  },
  onLoad() { },
  onShow() {
    this.getUbt();
    this.setShareWarrantData("mubt");
    this.setShareWarrantData("tubt");
  },

  // 初始化but和rmb
  getUbt() {
    const _self = this,
    registerCode = wx.getStorageSync('registerCode');
    UBT.retrieveUBT(registerCode, 'ubt').then(function (res) {
      const ubt = res.data && res.data.point ? res.data.point : 0
      _self.setData({
        ubt: ubt,
        rmb: ubt * 7
      });
    })
  },

  /**
   * 初始权证数值
   * @param {String} type 
   */
  setShareWarrantData(type) {
    const _self = this,
    registerCode = wx.getStorageSync('registerCode');
    let data = this.data.shareWarrantData;
    UBT.retrieveUBT(registerCode, type).then(res => {
      for (let i in data) {
        if (data[i].type === type) {
          data[i].number = res.data && res.data.point ? res.data.point : 0
        }
      }
      _self.setData({
        shareWarrantData: data
      });
    })
  }
})