// pages/main/main.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      nickName:"User",
      avatarUrl:"/image/"+(Math.random()*2+1).toFixed(0)+".jpg",
    },
    isPVP:0
  },
  
  // 对游客弹出一个禁止窗口 
  sendMsgBox(){
    wx.showToast({
      title: '该功能暂不对游客开放，请回到首页授权后重试',
      icon: 'none',
      duration: 2000//持续的时间
    })
  },

  clickImg(){
    wx.navigateTo({
      url: '../settings/settings',
    })
  },

  changeMode(){
    this.setData({
      isPVP:1-this.data.isPVP
    })
  },
  
  navitodt(){
    if(this.data.isPVP==0){
       wx.navigateTo({
      url: '../daily_task/daily_task',
    })
    }
  },

  navitopvp(){
    if(this.data.isPVP==1){
       wx.navigateTo({
      url: '../pvp/pvp',
    })
    }
  },

  statisticTap(){
    let uInfo=wx.getStorageSync('userInfo')
    if(uInfo){
      wx.navigateTo({
        url: '../statistic/statistic',
      })
    }else{
      this.sendMsgBox()
    }
  },

  rankTap(){
    let uInfo=wx.getStorageSync('userInfo')
    if(uInfo){
      wx.navigateTo({
        url: '../rank/rank',
      })
    }else{
      this.sendMsgBox()
    }
  },

  /*
    @brief: send a msgbox ask whether user provide his info and set userInfo in data
  */
  getNewUserInfo() {
    var that = this;
    const db = wx.cloud.database()
    wx.showModal({
      title: "提示",
      content: "获取个人信息以注册用户",
      success(res) {
        if (res.confirm) {
          wx.getUserProfile({
            desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              wx.setStorageSync('userInfo', {nickName:res.userInfo.nickName,avatarUrl:res.userInfo.avatarUrl})
              that.setData({
                userInfo:{nickName:res.userInfo.nickName,avatarUrl:res.userInfo.avatarUrl}
              })
              // 建立做题数据库 20221018
              wx.cloud.callFunction({
                name:'quickstartFunctions',
                data:{
                  type:'createTask',
                }
              });
              db.collection('userlist').add({
                data:{  //_openid会自动设置
                  nickName:that.data.userInfo.nickName,
                  avatarUrl:that.data.userInfo.avatarUrl,
                  regDate:new Date(Date.parse(new Date())), //special way to get date
                  coin:12,
                  isvip:false,
                  count:0
                },
                success: function(res) {    
                    console.log(res)
                },
                fail:function(res){
                  console.log(res)
                }
              })
            },
            fail: function (err) {
              console.log(err);
            },
          });
        }
      },
    });
  },

  /*
    @brief: judge openid in db? 
            if yes,get userInfo; 
            if not,init data and set it in db
  */
  userInit(){
    let that=this
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data:{
        type:'getOpenId'
      },
      success: res => {
        // 判断openid是否存在于数据库
        let openId=res.result.openid
        const db=wx.cloud.database()
        db.collection('userlist').where({
          _openid:openId
        }).get().then(ress => {
          // 判断返回的data长度是否为0，如果为0的话就证明数据库中没有存在该数据，然后进行添加操作
          if(ress.data.length==0){ 
            that.getNewUserInfo()
          }else{  //若openid已存在于数据库，调出数据库的头像和昵称、setData并存到本地
            wx.setStorageSync('userInfo', {nickName:ress.data[0].nickName,
              avatarUrl:ress.data[0].avatarUrl})
            that.setData({
              userInfo: {nickName:ress.data[0].nickName,
                avatarUrl:ress.data[0].avatarUrl}
            })
          }
        })
      }
    })
  },

  setUserInfo(){
    var uInfo=wx.getStorageSync('userInfo')
    if(!uInfo) {
      this.userInit()
    }else{this.setData({
        userInfo:uInfo
      })
    }
  },
  hiddenFunc() {
    console.log("Test func. ")
    wx.navigateTo({
      url: '../pvp/pvp',
    }).catch(err=>{
      console.error(err)
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
    this.setUserInfo()
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