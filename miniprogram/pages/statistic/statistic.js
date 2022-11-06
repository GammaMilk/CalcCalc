// pages/statistic/statistic.js
var context = wx.createContext()
var res = wx.getSystemInfoSync()
var width = new Array(7)
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
      width.push(this.data.x7)
      width.push(this.data.x6)
      width.push(this.data.x5)
      width.push(this.data.x4)
      width.push(this.data.x3)
      width.push(this.data.x2)
      width.push(this.data.x1)
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
    for(var i=1;i<=7;i++){
      //开始创建一个路径
      context.beginPath()
      //设置纯色填充
      context.setFillStyle("blue")
      //添加一个矩形路径到当前路径
      var wid = res.screenWidth*width.pop()*0.5/30
      console.log(wid)
      context.rect(0, 0, wid, 30)
      //对当前路径进行填充
      context.fill()
      wx.drawCanvas({
      canvasId: 'Canvastiaoxing' + String(i),
      actions: context.getActions()
  })
    }

    
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