// pages/bigvip/bigvip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      avatarUrl:"/image/"+(Math.random()*2+1).toFixed(0)+".jpg"
    },
    isVIP:false,
  },

  getStorageUserInfo(){
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
        this.setData({
          userInfo:userInfo,
          isVisitor:false
        })
        return;
    }
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getStorageUserInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})