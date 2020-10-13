const app = getApp()
const UBT = require('../../utils/ubt.js')

Page({
  data: {},
  onLoad() { },
  onShow() {
    this.getData();
  },

  async getData() {
    const uid = wx.getStorageSync('uid'),
      data = await UBT.getListPointRecord(uid);
    this.setData({
      ubtData: data
    })
  },
})