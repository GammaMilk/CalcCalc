// pages/finish/finish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  continueTap(){
    wx.redirectTo({
      url: '../daily_task/daily_task',
    })
  },

  finishTap(){
    let uInfo=wx.getStorageSync('userInfo')
    if(!uInfo){
      wx.redirectTo({
        url: '../main/main',
      })
      return
    }
    wx.redirectTo({
      url: '../rank/rank',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name:'quickstartFunctions',
      data:{
        type:'updateTask',
        count:wx.getStorageSync('quantityOfQuestions')
      }
    }).catch(err=>{
      console.error(err);
    })
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