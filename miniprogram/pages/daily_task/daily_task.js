// pages/daily_task/daily_task.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bit1:1,
    bit2:1,
    level:['加减','加减乘','加减乘除'],
    num:30,
    dif:0,
    df:'jb',
    isRank:0,
    modalHidden:true
  },

  setStorageData(){
    try {
      let dif=wx.getStorageSync("arithmeticLevel")
      let bit1=wx.getStorageSync("digit1Bits")
      let bit2=wx.getStorageSync("digit2Bits")
      let num=wx.getStorageSync("quantityOfQuestions")
      if ((dif+1)&&bit1&&bit2&&num) {
        this.setData({
          df:this.data.level[dif+1],
          bit1:bit1,
          bit2:bit2,
          num:num
        })
        console.log(this.data.df)
      }
    } catch (e) {
      console.log(e)
    }
  },

  startTap(){
    let rediURL = '../start/start?isRank='+this.data.isRank;
    wx.redirectTo({
      url: rediURL,
    })
  },

  navitodf(){
    wx.redirectTo({
      url: '../question_difficulty/question_difficulty',
    })
  },

  
 

  changeRank(){
    this.setData({
      isRank:1-this.data.isRank
    })
  },

  /**
   * 显示弹窗
   */
  showinfo: function() {
    this.setData({
      modalHidden: false
    })
  },

  /**
   * 点击取消
   */
  modalCancel: function() {
    // do something
    this.setData({
      modalHidden: true
    })
  },

  /**
   *  点击确认
   */
  modalConfirm: function() {
    // do something
    this.setData({
      modalHidden: true
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
    this.setStorageData();
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