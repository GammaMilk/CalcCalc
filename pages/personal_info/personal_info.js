// pages/personal_info/personal_info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      nickName:"User",
      avatarUrl:"/image/"+(Math.random()*2+1).toFixed(0)+".jpg"
    },
    tabType: 'tab1',
        key: 'tab1',
        conditionList: [{
                title: '幼儿园',
                id: '1',
                select: true
            },
            {
                title: '小学',
                id: '2',
                select: false
            },
            {
                title: '初中',
                id: '3',
                select: false
            },
            {
                title: '高中',
                id: '4',
                select: false
            },
            {
                title: '大学',
                id: '5',
                select: false
            },
        ],
        choosedCondition: {
            title: '小学',
            id: '1'
        },
        conditionVisible: false,
  },

  showCondition() {
    this.setData({
        conditionVisible: !this.data.conditionVisible
    })
},
// 改变查询项
onChnageCondition(e) {
    const list = this.data.conditionList
    list.forEach(item => {
        if (item.id === e.currentTarget.dataset.id) {
            item.select = true
            this.setData({
                'choosedCondition.title': item.title,
                'choosedCondition.id': item.id
            })
        } else {
            item.select = false
        }
    })
    this.setData({
        conditionList: list
    })
},

  clickImg(){
    wx.navigateTo({
      url: '../change_profile_photo/change_profile_photo'
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

  },

  getStorageUserInfo(){
    var that = this;
    let nowTime = Date.now();
    let oldTime = wx.getStorageSync("userInfoStorageTime");
    let userInfo = wx.getStorageSync("userInfo");
    if ( userInfo.nickName != undefined && userInfo.nickName != null && userInfo.nickName != "" ) {
      if (oldTime && nowTime < oldTime) {
        that.setData({
          userInfo:userInfo
        })
        return;
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getStorageUserInfo();
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