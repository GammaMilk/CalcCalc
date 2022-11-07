// app.js
App({
  uploadFenshu:function (add) {
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
  },
  ticketCost: function(score) {
    if (score <= 99) return 10;
    else if (score <= 299) return 15;
    else if (score <= 799) return 20;
    return 30;
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-4g86myxu7e413a6c',
        traceUser: true,
      });
    }

    this.globalData = {};
  }
});
