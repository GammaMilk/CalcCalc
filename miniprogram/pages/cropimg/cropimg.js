//获取应用实例
const app = getApp()
Page({
  data: {
    src: '',
    width: 256, //宽度
    height: 256, //高度
    max_width: 300,
    max_height: 300,
    disable_rotate: false, //是否禁用旋转
    disable_ratio: true, //锁定比例
    limit_move: true, //是否限制移动
  },
  onLoad: function (options) {
    this.cropper = this.selectComponent("#image-cropper");
    if (!options.filepath) {
      this.cropper.upload(); //上传图片
    };
    this.setData({
      src: decodeURIComponent(options.filepath)
    });
  },
  cropperload(e) {
    console.log('cropper加载完成');
  },
  loadimage(e) {
    wx.hideLoading();
    console.log('图片');
    this.cropper.imgReset();
  },
  clickcut(e) {
    console.log(e.detail);
    //图片预览
    wx.previewImage({
      current: e.detail.url, // 当前显示图片的http链接
      urls: [e.detail.url] // 需要预览的图片http链接列表
    })
  },
  submit() {
    this.cropper.getImg((obj) => {
      wx.setStorageSync('uploadurl', obj.url);
      var cps = getCurrentPages();
      let p = cps[cps.length-2];
      // console.log(p);
      p.compressAndUpload()
      wx.navigateBack({
        delta:0
      });
    });
  },
  rotate() {
    //在用户旋转的基础上旋转90°
    this.cropper.setAngle(this.cropper.data.angle += 90);
  },
  end(e) {
    clearInterval(this.data[e.currentTarget.dataset.type]);
  },
})