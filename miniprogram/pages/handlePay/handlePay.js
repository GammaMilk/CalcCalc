// pages/handlePay/handlePay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:'',
    wxqrurl:'cloud://cloud1-4g86myxu7e413a6c.636c-cloud1-4g86myxu7e413a6c-1314056347/picture/wxQRCode.jpg',
    zfbqrurl:'cloud://cloud1-4g86myxu7e413a6c.636c-cloud1-4g86myxu7e413a6c-1314056347/picture/payQRCode.jpg'
  },
  saveImage(e){
    wx.vibrateShort({
      type: 'medium',
    })
    wx.showLoading({
      title: '正在请求数据',
    })
    var url = ''
    switch (e.currentTarget.id) {
      case 'wxqr':
        url = this.data.wxqrurl;
        break;
      case 'zfbqr':
        url = this.data.zfbqrurl;
      default:
        break;
    }
    wx.cloud.downloadFile({
      fileID: url,
    }).then(res=>{
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success: (res) => {wx.showToast({
            title: '已经保存图片到相册',
            icon: 'success'
          })
        },
        fail: (res) => {console.error(res);wx.showToast({
          title: '保存失败！',
          icon:'error'
        })},
        complete: (res) => {wx.hideLoading({
          success: (res) => {},
        })},
      })
    })
    
    console.log(url)
  },
  getOpenidTap(){
    let that = this
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data:{
        type:'getOpenId'
      },
      success: res => {
        wx.setClipboardData({
          data: res.result.openid,
          success: function (ress) {
              wx.showToast({
                  title: '复制openid成功',
                  icon:"success"
              });
          }
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