// pages/settings/settings.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      nickName:"User",
      avatarUrl:"/image/"+(Math.random()*2+1).toFixed(0)+".jpg"
    },
    isVisitor:true,
    isVIP:false,
    coin:'0'
  },

  // 对游客弹出一个禁止窗口 
  sendMsgBox(){
    wx.showToast({
      title: '该功能暂不对游客开放，请回到首页授权后重试',
      icon: 'none',
      duration: 2000//持续的时间
    })
  },

  showLoading(message) {
    if (wx.showLoading) {
        // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
        wx.showLoading({
            title: message,
            mask: true
        });
    } else {
        // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
        wx.showToast({
            title: message,
            icon: 'loading',
            mask: true,
            duration: 20000
        });
    }
  },

  hideLoading() {
    if (wx.hideLoading) {
        // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
        wx.hideLoading();
    } else {
        wx.hideToast();
    }
  },

  // 判断是否为游客模式，若为游客则暂时无法进入
  clickImg(){
    if(!this.data.isVisitor){
      wx.navigateTo({
        url: '../personal_info/personal_info'
      })
    }else {
      this.sendMsgBox()
    }
  },

  personalInfoTap(){
    this.clickImg()
  },

  difficultySettingTap(){
    wx.navigateTo({
      url: '../question_difficulty/question_difficulty',
    })
  },

  bigVIPTap(){
    if(!this.data.isVisitor){
      wx.navigateTo({
        url: '../bigvip/bigvip'
      })
    }else {
      this.sendMsgBox()
    }
  },

  rankTap(){
    if(!this.data.isVisitor){
      wx.navigateTo({
        url: '../rank/rank'
      })
    }else {
      this.sendMsgBox()
    }
  },

  statisticTap(){
    if(!this.data.isVisitor){
      wx.navigateTo({
        url: '../statistic/statistic'
      })
    }else {
      this.sendMsgBox()
    }
  },
  
  getStroageUserInfo(){
    // 若为游客，则直接返回
    let userInfo = wx.getStorageSync("userInfo");
    if (!userInfo)  {
      this.hideLoading()
      return
    }
    let that=this
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data:{
        type:'getOpenId'
      },
      success: res => {
        let openId=res.result.userInfo.openId
        const db=wx.cloud.database()
        db.collection('userlist').where({
          _openid:openId
        }).get().then(ress => {
          that.setData({
            userInfo:userInfo,
            isVisitor:false,
            isVIP:ress.data[0].isvip,
            coin:ress.data[0].coin,
          })
          this.hideLoading()
        })
      }
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
    this.showLoading('Loading')
    this.getStroageUserInfo()
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