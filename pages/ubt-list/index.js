const app = getApp()
const UBT = require('../../utils/ubt.js')

Page({
  data: {},
  onLoad() { },
  onShow() {
    this.getData();
  },

  async getData() {
    const registerCode = wx.getStorageSync('registerCode'),
      data = await UBT.getListPointLog(registerCode);
    this.setData({
      ubtData: data
    })
  },
})