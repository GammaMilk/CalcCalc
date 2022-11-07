// pages/pvp/pvp.js
/**
 * @brief generate a problem from user's selected digs and level
 * @param d1: int, number of digits of num1
 * @param d2: int, number of digits of num2
 * @param l: int, level of the problem (1,2,3)
 * @return [op, num1, num2, ans]:int array
 */
var aProblem = function(d1,d2,l){
  // generate a problem with d1 and d2 digs and level l
  // level 1: +, -
  // level 2: +, -, *
  // level 3: +, -, *, /

  // generate two random numbers
  var num1 = Math.floor(Math.random() * Math.pow(10, d1));
  var num2 = Math.floor(Math.random() * Math.pow(10, d2));
  if (num1 < num2){
    var tmp = num1;
    num1 = num2;
    num2 = tmp;
  }

  // generate a random operator
  var op = Math.floor(Math.random() * (l+1));
  var ans = 0;
  switch(op){
    case 0:
      ans = num1 + num2;
      break;
    case 1:
      ans = num1 - num2;
      break;
    case 2:
      ans = num1 * num2;
      break;
    case 3:
      // make sure ans is an integer
      do{
        num1 = Math.floor(Math.random() * Math.pow(10, d1));
        num2 = Math.floor(Math.random() * Math.pow(10, d2));
        if (num1 < num2){
          var tmp = num1;
          num1 = num2;
          num2 = tmp;
        }
      }while(num1 % num2 != 0);
      ans = num1 / num2;
      break;
  }
  return [op, num1, num2, ans];
}

var timerID = null;
var minute = 0;
var second = 0;
const nProblems = 20;
var wsTask2 = null;
var wsTask1 = null;
var roomid=-1;
var p='p';
var watcherCloser = null;
var openid = '';
var isRunning = false;
Page({
  data: {
    C: 'C',
    id0: '0',
    id1: '1',
    id2: '2',
    id3: '3',
    id4: '4',
    id5: '5',
    id6: '6',
    id7: '7',
    id8: '8',
    id9: '9',
    back:'back',
    result:'',
    opArray:['+','-','×','÷'],
    operator:'+',
    num1:0,
    num2:0,
    ans:0,
    count:0,
    minute:0,
    second:0,
    questionArray:[],
    anotherCount:0,
    rival:'对手'
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

  // Merky balabala a lot which make me angry when I write this method.
  clickButton: function (event) {
    let that = this;
    //console.log(this.data)
    if (event.target.id == 'back') {  // Tap back
      if(this.data.result=='') return
      else {
        this.setData({
          result:this.data.result.substr(0,this.data.result.length-1)
        })
      }
    }
    else if (event.target.id == 'C') {  // AC once tap 'C'
      this.setData({
        result: ''
      });
    }
    else {   // tap a digit
      if(event.target.id=='0'&&this.data.result!='0'){  // protect result from 0000000
        this.setData({
          result:this.data.result+'0'
        })
      }else{  // tap a digit except 0
        this.setData({
          result:this.data.result+event.target.id
        })
      }
      /*
        judge result==ans? 
        if true, update db and judge if finished
        if finished, navigate to finish page
      */
      if(this.data.result==this.data.ans){
        // 答对了！
        this.setData({
          count:this.data.count+1
        })

        // 使用新型API
        wsTask2.send({
          data: "add"
        })
        //judge if finished
        if(this.data.questionArray.length==0) {
          this.stop();
          this.showLoading('Loading')
          let cnt=wx.getStorageSync('quantityOfQuestions')
          let uInfo=wx.getStorageSync('userInfo')
          let rediURL = '../finish/finish?seconds='+(that.data.second - (-60*that.data.minute))+'&count='+that.data.count;
          if(!uInfo){
            wx.redirectTo({
              url: rediURL,
            })
            return
          }
          wx.cloud.callFunction({
            name: 'quickstartFunctions',
            data:{
              type:'matchMgr',
              matchOption:'end',
              p:p,
              roomid:roomid,
              time:(that.data.second - (-60*that.data.minute))
            },
          })
          // 完成了 直接跳转走。。。数据库成不成功再说。
          wx.redirectTo({
            url: rediURL,
          })
          wx.cloud.callFunction({ // 完成设定的任务数量时，记录到数据库
            name: 'quickstartFunctions',
            data:{
              type:'getOpenId'
            },
            success: res => {
              let openId=res.result.openid
              const db=wx.cloud.database()
              const _ = db.command
              db.collection('userlist').where({
                _openid:openId
              }).update({
                data:{
                  count:_.inc(cnt)
                },success: function() {
                  console.log("success to increase")
                }
              })
            }
          }) 
        }else{  // 还未完成时，继续出题
          let q=this.data.questionArray.pop()
          this.setData({  //初始化下一个题目
          operator:this.data.opArray[q[0]],
          num1:q[1],
          num2:q[2],
          ans:q[3],
          result:'',
          questionArray:this.data.questionArray
      })
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("OnLoad Called")
    const that = this;
    const db = wx.cloud.database();// 等人匹配
    wx.showLoading({
      title: '正在等待匹配',
    });
    wx.cloud.callFunction({ // getOpenid
      name: 'quickstartFunctions',
      data:{
        type:'getOpenId'
      }
    }).then(res=>{
      openid=res.result.openid;
      roomid = -1;
      let userInfo = wx.getStorageSync('userInfo');
      let nickName = userInfo.nickName;
      wsTask1 = wx.connectSocket({
        url: "wss://api.jsnsl.cn/ws/hall"
      });
      wsTask1.onOpen(function onOpen(){
        wsTask1.send({
          data:JSON.stringify({openid:openid,nickName:nickName})
        })
      });
      wsTask1.onMessage(res=>{
        var o = JSON.parse(res.data)
        if(o.roomid!=null) {
          // 匹配到了！！！！！
          isRunning = true;
          wx.hideLoading({
            success: (res) => {},
          })
          // Got an roomid
          roomid = o.roomid;
          // Enter next stage.
          that.wsStage2();
          wsTask1.close();
        }
      })
    })
    try {
      let d1=2
      let d2=2
      let l=2
      let quantity=20
      let qArray=[]
      while(quantity--){
        qArray.push(aProblem(d1,d2,l))
      }
      this.setData({
        questionArray:qArray
      })
      console.log(this.data.questionArray)
      let q=this.data.questionArray.pop()
      this.setData({  //初始化第一个题目
        operator:this.data.opArray[q[0]],
        num1:q[1],
        num2:q[2],
        ans:q[3],
        questionArray:this.data.questionArray
      })
    } catch (error) {
      console.log(error)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  },

  
  start: function() { //开始计时函数
    var that = this;
    if (timerID!=-1) {
      that.stop();
      second=0;
      minute=0;
    }
    this.resume();
  },

  stop: function() { //停止计时函数
    if (watcherCloser != null)
      watcherCloser.close();
    if (wsTask2 != null) {
      wsTask2.close();
      wsTask2 = null;
    }
    if (wsTask1 != null) {
      wsTask1.close();
      wsTask1 = null;
    }
    console.log("stop called")
    second=0;
    minute=0;
    this.pause();
  },

  pause: function () {
    clearInterval(timerID);
    timerID = null;
  },

  resume: function () {
    if (timerID == null){
      timerID = setInterval(() => {
        this.timer()
      }, 1000) //每隔1s调用一次timer函数
    }
  },

  timer: function() { //计时函数
    var that = this;
    if (second >= 59) {
      second = 0;
      that.setData({
        minute: ++minute,
        second: 0
      })
    } else {
      that.setData({
        second: ++second
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log("onHide Called")
    this.pause();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log("OnShow Called")
    if (isRunning)
    this.resume()
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log("onUnload Called")
    this.stop();
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

  },

  wsStage2(){
    const that = this;
    that.start();
    let url = "wss://api.jsnsl.cn/ws/room/"+roomid+"/"+openid;
    console.log(url);
    // Create a websocket task.
    wsTask2 = wx.connectSocket({
      url: url,
    });

    // handle onMsg
    wsTask2.onMessage(res=>{
      var o = JSON.parse(res.data);
      if (o.errno != 0) {
        // err occurred. handle
        console.error(o);
        if (that.data.anotherCount >= 20) {
          wx.showToast({
            title: '对方已完成！',
            icon: 'success',
            duration: 1500
          });
        } else {
          wx.showToast({
            title: '对方离开比赛！',
            icon: 'error',
            duration: 2000
          });
        }
      } else {
        // normal condition
        that.setData({
          rival:o.anotherNickName,
          anotherCount: o.anotherAdd
        })
      }
    }) // end onMessage


  }
})