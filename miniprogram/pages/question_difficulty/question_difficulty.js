// pages/question_difficulty/question_difficulty.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    level:['easy','medium','hard'],
    select: false,
    arithmeticLevel:['加减','加减乘','加减乘除'],
    arithmeticMode: '加减',
    digit1Bits:1,
    digit2Bits:1,
    quantityOfQuestions:30
  },
  
  //展示下拉栏
  bindShowMsg() {
    this.setData({
        select:!this.data.select
    })
  },

  //下拉选择，并存储选择的难度
  mySelect(e) {
    console.log(e)
    var name = e.currentTarget.dataset.name
    this.setData({
        arithmeticMode: name,
        select: false
    })
  },

  digit1BitsSubTap(e){
    if(this.data.digit1Bits==1) return
    else {
      this.setData({
        digit1Bits:this.data.digit1Bits-1
      })
    }
  },

  digit1BitsAddTap(e){
    if(this.data.digit1Bits==5) return
    else {
      this.setData({
        digit1Bits:this.data.digit1Bits+1
      })
    }
  },

  digit2BitsSubTap(e){
    if(this.data.digit2Bits==1) return
    else {
      this.setData({
        digit2Bits:this.data.digit2Bits-1
      })
    }
  },

  digit2BitsAddTap(e){
    if(this.data.digit2Bits==5) return
    else {
      this.setData({
        digit2Bits:this.data.digit2Bits+1
      })
    }
  },

  quantitySub5Tap(e){
    if(this.data.quantityOfQuestions==5) return
    else {
      this.setData({
        quantityOfQuestions:this.data.quantityOfQuestions-5
      })
    }
  },

  quantityAdd5Tap(e){
    if(this.data.quantityOfQuestions==50) return
    else {
      this.setData({
        quantityOfQuestions:this.data.quantityOfQuestions+5
      })
    }
  },

  saveTap(e) {  //将修改后的做题任务存储到本地
    wx.setStorageSync("arithmeticLevel",this.data.arithmeticLevel.indexOf(this.data.arithmeticMode))
    wx.setStorageSync("digit1Bits",this.data.digit1Bits)
    wx.setStorageSync("digit2Bits",this.data.digit2Bits)
    wx.setStorageSync("quantityOfQuestions",this.data.quantityOfQuestions)
  },

  setStorageData(){
    try {
      let level=wx.getStorageSync("arithmeticLevel")
      let bits1=wx.getStorageSync("digit1Bits")
      let bits2=wx.getStorageSync("digit2Bits")
      let quantity=wx.getStorageSync("quantityOfQuestions")
      if (level&&bits1&&bits2&&quantity) {
        this.setData({
          arithmeticMode:this.data.arithmeticLevel[level],
          digit1Bits:bits1,
          digit2Bits:bits2,
          quantityOfQuestions:quantity
        })
      }
    } catch (e) {
      console.log(e)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   * 加载存储的做题任务
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

  },
  
})