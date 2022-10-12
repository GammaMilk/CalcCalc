// pages/main/main.js
var app = getApp();
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      nickName:"User",
      avatarUrl:"/image/"+(Math.random()*2+1).toFixed(0)+".jpg"
      //avatarUrl:"/image/1.jpg"
    }
  },

clickImg(){
  wx.navigateTo({
    url: '../settings/settings',
  })
},
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setUserInfo();
  },
  
  getUserProfile() {
    var that = this;
    wx.showModal({
      title: "提示",
      content: "是否允许获取微信昵称和头像？",
      success(res) {
        if (res.confirm) {
          wx.getUserProfile({
            desc: "用于完善用户资料", // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              that.setData({
                userInfo: res.userInfo
              });
              wx.setStorageSync("userInfo", res.userInfo);
            },
            fail: function (err) {
              console.log(err);
            },
          });
        }
      },
    });
  },
  setUserInfo() {
    var that = this;
    let userInfo = wx.getStorageSync("userInfo");
    if ( userInfo.nickName != undefined && userInfo.nickName != null && userInfo.nickName != "" ) {
        that.setData({
          userInfo:userInfo
        })
        return;
      }
    else {
      that.getUserProfile();
    }
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