const app = getApp()
const UBT = require('../../utils/ubt.js')

Page({
  data: {
  },
  onLoad() { },
  onShow() { },
  async registerUid() {
    const uid = await wx.getStorageSync('uid');
    const obj = {
      password: "1234",
      registerCode: "123456",
      uid: uid.toString()
    }
    const code = await UBT.registerUid(obj);
  },

  async deregisterUid() {
    const uid = await wx.getStorageSync('uid');
    const obj = {
      password: "1234",
      registerCode: "123456",
      uid: uid.toString()
    }
    const code = await UBT.deregisterUid(obj);
  },
})