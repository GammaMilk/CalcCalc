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
    inputValue: '',
  },

  getStorageUserInfo(){
    let userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
        this.setData({
          userInfo:userInfo,
        })
        return;
    }
  },

  // upload an image to temp path and then call uploadPhotoToDatabase function
  uploadImg(){
    var that=this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success(res) {
        // 裁剪
        var photoTempPath = res.tempFiles[0].tempFilePath
        wx.navigateTo({
          url: '../cropimg/cropimg?filepath='+encodeURIComponent(photoTempPath),
        })
      }
    })
  },
  compressAndUpload(){
    let that = this;
    wx.compressImage({
      src: wx.getStorageSync('uploadurl'),
      compressedHeight :256,
    }).then(res2=>{
      that.uploadPhotoToDatabase(res2.tempFilePath);
    }).catch(e=>{
      console.error(e)
    })
  },

  // storage the image user uploaded and set it in db
  uploadPhotoToDatabase(photoTempPath) {
    let nickName=wx.getStorageSync('userInfo').nickName
    let that=this
    wx.cloud.uploadFile({
      cloudPath:"photo/"+nickName+Date.now()+".jpg",
      filePath:photoTempPath
    })
    .then(res=>{
      // console.log(res)
      wx.setStorageSync('userInfo', {nickName:nickName,avatarUrl:res.fileID})
      that.setData({
        userInfo:{nickName:nickName,avatarUrl:res.fileID}
      })
      wx.showToast({
        title: '上传图片成功',
        icon: 'none',
        duration: 2000//持续的时间
      })
      // get user's _openid and update avatarUrl
      wx.cloud.callFunction({
        name: 'quickstartFunctions',
        data:{
          type:'getOpenId'
        },
        success: ress => {
          let openId=ress.result.userInfo.openId
          const db=wx.cloud.database()
          db.collection('userlist').where({
            _openid:openId
          }).update({
            data:{
              avatarUrl:res.fileID
            },
            success: function() {
              console.log("success")
            }
          })
        }
    })
  })
},

  uploadImgTap(){
    this.uploadImg()
  },

  randomImgTap(){
    let nickName=wx.getStorageSync('userInfo').nickName
    wx.setStorageSync('userInfo', {nickName:nickName,avatarUrl:"/image/"+(Math.random()*2+1).toFixed(0)+".jpg"})
    this.setData({
      userInfo:{
        nickName:this.data.nickName,
        avatarUrl:"/image/"+(Math.random()*2+1).toFixed(0)+".jpg"
      }
    })
    wx.showToast({
      title: '生成图片成功',
      icon: 'none',
      duration: 2000//持续的时间
    })
  },

  bindKeyInput(e){
    this.setData({
      inputValue: e.detail.value
    })
  },

  // 提交新的昵称到数据库
  submitTap(){
    //console.log(this.data.inputValue)
    let nickName=this.data.inputValue
    let that=this
    if(!nickName) { // 输入框为空时弹出窗口
      wx.showToast({
        title: '请勿输入空值！',
        icon: 'none',
        duration: 2000//持续的时间
      })
      return
    }
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data:{
        type:'getOpenId'
      },
      success: res => {
        let openId=res.result.userInfo.openId
        const db=wx.cloud.database()
        const _ = db.command
        db.collection('userlist').where({
          _openid:openId
        }).get().then(ress => {
          //console.log(ress.data[0].coin)
          if(ress.data[0].coin<6) { //硬币小于六个弹出弹窗
            wx.showToast({
              title: '硬币小于6个，快去攒点硬币吧',
              icon: 'none',
              duration: 2000//持续的时间
            })
          }else{  // 修改名字，改本地、数据库和page.data，并减少六个硬币
            let avatarUrl=wx.getStorageSync('userInfo').avatarUrl
            that.setData({
              userInfo:{
                nickName:nickName,
                avatarUrl:avatarUrl
              }
            })
            wx.setStorageSync('userInfo', that.data.userInfo)
            db.collection('userlist').where({
              _openid:openId
            }).update({
              data:{
                nickName:nickName,
                coin:_.inc(-6)
              },success: function() {
                console.log("success")
                wx.showToast({
                  title: '昵称修改成功',
                  icon: 'none',
                  duration: 2000//持续的时间
                })
              }
            })
          }
        }
        )
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
    this.getStorageUserInfo();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

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