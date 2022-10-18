// pages/rank/rank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    users:[],
    me:-1,
    //indexOfUser:0
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

  getRank(){
    const db=wx.cloud.database()
    const _ = db.command
    const $ = db.command.aggregate
    const MAX_LIMIT=10
    let that=this
    //let nickName=wx.getStorageSync("userInfo").nickName
    //console.log(nickName)

    // Here select user's self data
    // first get OPENID
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data:{
        type:'getOpenId'
      },
      // then get rank
    }).then(res=>{
      let openId=res.result.openid
      return db.collection('userlist').aggregate().sort({"count":-1}).group({_id:null,all:$.push("$_openid")}).project({
        _id:0,
        rank:$.indexOfArray(['$all',openId])
      }).end()
    }).then(res=>{
      console.log("排名:")
      let rank = res.list[0].rank - (-1)
      console.log(rank)
      that.setData({
        me:rank
      })
    }).catch(e=>{
      console.error(e)
    })


    // Here select first 10 users;
    // '.limit' was added by merky
    db.collection('userlist').orderBy("count","desc").limit(MAX_LIMIT).get().then(res=>{
      for(let i=0;i<MAX_LIMIT&&i<res.data.length;++i){
        //if(res.data[i].nickName==nickName) {indexOfUser=i
        //console.log(indexOfUser)}
        that.data.users.push(res.data[i])
      }
      that.setData({
        users:that.data.users
      })
      this.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.showLoading('Loading')
    this.getRank()
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