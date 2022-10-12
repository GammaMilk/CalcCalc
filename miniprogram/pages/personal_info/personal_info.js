// pages/personal_info/personal_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      nickName:"User",
      avatarUrl:"/image/"+(Math.random()*2+1).toFixed(0)+".jpg"
    },
  },

  clickImg(){
    wx.navigateTo({
      url: '../change_profile_photo/change_profile_photo'
    })
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

  },

  getStorageUserInfo(){
    var that = this;
    let userInfo = wx.getStorageSync("userInfo");
    if ( userInfo.nickName != undefined && userInfo.nickName != null && userInfo.nickName != "" ) {
        that.setData({
          userInfo:userInfo
        })
        return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getStorageUserInfo();
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