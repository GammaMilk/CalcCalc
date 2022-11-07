// pages/finish/finish.js
var ticketCost = function(score) {
  if (score <= 99) return 10;
  else if (score <= 299) return 15;
  else if (score <= 799) return 20;
  return 30;
}
var uploadFenshu = function (add) {
  return new Promise(function (resolve, reject) {
    wx.cloud.callFunction({ // 完成设定的任务数量时，记录到数据库
      name: 'quickstartFunctions',
      data:{
        type:'rank',
        add:add
      },
      success:res=>{
        resolve(res.result)
      },
      fail:err=>{
        reject(err)
      }
    })
  })
}
Page({

  

  /**
   * 页面的初始数据
   */
  data: {
    count:0,
    second:0,
    coin:0,
    isRank:false,
    score:0
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
    console.log(options)
    this.setData({
      count:options.count,
      second:options.seconds,
      coin:options.coin
    })
    if(options.isRank==1) this.setData({isRank:true})
    uploadFenshu(0).then(res=>{
      console.log("当前的排位分数：",res)
      this.setData({
        score:options.addScore
      })
    })
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