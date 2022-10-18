// pages/statistic/statistic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    x1:0,
    x2:0,
    x3:0,
    x4:0,
    x5:0,
    x6:0,
    x7:0,
  },
  torankTap(){
    wx.redirectTo({
      url: '../rank/rank',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    wx.cloud.callFunction({
      name:'quickstartFunctions',
      data:{
        type:'getTask'
      }
    }).then(r=>{
      that.setData({
        x1:r.result.x1,
        x2:r.result.x2,
        x3:r.result.x3,
        x4:r.result.x4,
        x5:r.result.x5,
        x6:r.result.x6,
        x7:r.result.x7,
      })
      console.log(r)
    }).catch(err=>{
      console.error(err)
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