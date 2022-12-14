// pages/start/start.js
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
/**
 * @brief get the score of the problem
 * @param {number} op Operator in [0,1,2,3]
 * @param {number} num1 Number 1
 * @param {number} num2 Number 2
 * @returns the score of the problem
 */
var score = function (op,num1,num2) {
  // get digits of num1 and num2
  var d1 = num1.toString().length;
  var d2 = num2.toString().length;

  // assert d1>=d2
  if (d1 < d2){
    var tmp = d1;
    d1 = d2;
    d2 = tmp;
  }

  // for op==0 or 1, score = ((d1+d2)/2)^1.9
  // for op==2, score = d1*(2.5*d2+0.05*d2^2+((d1+d2)/2)^1.9)
  // for op==3, score = d1-d2+1

  var s = 0;
  switch(op){
    case 0:
    case 1:
      s = Math.pow((d1+d2)/2, 1.9);
      break;
    case 2:
      s = d1*(2.5*d2+0.05*Math.pow(d2,2)+Math.pow((d1+d2)/2,1.9));
      break;
    case 3:
      s = d1-d2+1;
      break;
    default:
      break;
  }
  return s;
}

var uploadFenshu = function (add) {
  return new Promise(function (resolve, reject) {
    wx.cloud.callFunction({ // ???????????????????????????????????????????????????
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
}

var ticketCost = function(score) {
  if (score <= 99) return 10;
  else if (score <= 299) return 15;
  else if (score <= 799) return 20;
  return 30;
}

var timerID = 0;
var minute = 0;
var second = 0;
var score_total = 0;
var animation;
var isRank = 0;
var rankScore = 0;
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
    opArray:['+','-','??','??'],
    operator:'+',
    num1:0,
    num2:0,
    ans:0,
    count:0,
    minute:0,
    second:0,
    questionArray:[],
    quantityOfQuestion:0,
    animation:wx.createAnimation()
  },
  
  showLoading(message) {
    if (wx.showLoading) {
        // ????????? 1.1.0 ??????6.5.6????????????????????????????????????????????????
        wx.showLoading({
            title: message,
            mask: true
        });
    } else {
        // ???????????????Toast??????????????????????????????20?????????????????????
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
        if(this.data.count+1<this.data.quantityOfQuestion){
          this.setData({
            count:this.data.count+1
          })
        }
        //judge if finished
        if(this.data.questionArray.length==0) {
          // ????????????????????????????????????????????????
          // ?????????????????????????????????!!!
          this.stop();
          this.showLoading('????????????')
          let cnt=wx.getStorageSync('quantityOfQuestions')
          let uInfo=wx.getStorageSync('userInfo')
          var usedSeconds = (that.data.second - (-60*that.data.minute))

          var addScore = 0;
          if (isRank) {
            // ????????????????????????
            addScore = score_total/usedSeconds*27;
            console.log("??????????????????????????????",addScore)
            var ticket = ticketCost(rankScore);
            console.log("???????????????????????????",ticket)
            addScore -= ticket;
            uploadFenshu(addScore)
          }
          
          let rediURL = '../finish/finish?seconds='+usedSeconds+'&count='+that.data.count+'&coin='+score_total+'&addScore='+addScore+'&isRank='+isRank;
          if(!uInfo){
            wx.redirectTo({
              url: rediURL,
            })
            return
          }
          wx.cloud.callFunction({ // ???????????????????????????????????????????????????
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
                  count:_.inc(cnt),
                  coin: _.inc(0.0085*score_total)
                },success: function() {
                  console.log("success")
                  wx.redirectTo({
                    url: rediURL,
                  })
                }
              })
            }
          }) 
        }else{  // ??????????????????????????????
          setTimeout(() => {
            this.animation.translate(0,5).step().translate(0).step()
            this.setData({animation: this.animation.export()})
          }, 30);
          let q=this.data.questionArray.pop()
          let s = score(q[0],q[1],q[2])
          score_total += s;
          setTimeout(() => {
            this.setData({  //????????????????????????
              operator:this.data.opArray[q[0]],
              num1:q[1],
              num2:q[2],
              ans:q[3],
              result:'',
              questionArray:this.data.questionArray
            })
          }, 150);
        }
      }
    }
  },

  /**
   * ??????????????????--??????????????????
   */
  onLoad(options) {
    
    console.log("options:",options)
    if (options.isRank == 1) isRank = 1;
    else isRank = 0;
    score_total = 0;

    // ????????????????????????????????????
    if (isRank) {
      console.warn("?????????!!!!")
      uploadFenshu(0).then(res=>{
        console.log("????????????????????????",res)
        rankScore = res;
      })
    }

    try {
      let d1=wx.getStorageSync('digit1Bits')
      let d2=wx.getStorageSync('digit2Bits')
      let l=wx.getStorageSync('arithmeticLevel')+1
      let quantity=wx.getStorageSync("quantityOfQuestions") 
      if(d1=='') {
        d1=1,d2=1,l=1,quantity=30
        wx.setStorageSync('digit1Bits', 1)
        wx.setStorageSync('digit2Bits', 1)
        wx.setStorageSync('arithmeticLevel', 1)
        wx.setStorageSync('quantityOfQuestions', 30)
      }
      if (d1&&d2&&l&&quantity) {
        let qArray=[]
        for(let i=1;i<=quantity;++i){
          qArray.push(aProblem(d1,d2,l))
        }
        this.setData({
          questionArray:qArray,
          quantityOfQuestion:quantity
        })
        console.log(this.data.questionArray)
        let q=this.data.questionArray.pop()
        this.setData({  //????????????????????????
          operator:this.data.opArray[q[0]],
          num1:q[1],
          num2:q[2],
          ans:q[3],
          questionArray:this.data.questionArray
        })
      }
    } catch (error) {
      console.log(error)
    }
  },

  /**
   * ??????????????????--??????????????????????????????
   */
  onReady() {
    score_total = 0;
    this.animation = wx.createAnimation({
      duration:100
    })
  },

  /**
   * ??????????????????--??????????????????
   */
  onShow() {
    score_total = 0;
    this.start()
  },
  
  start: function() { //??????????????????
    var that = this;
    if (timerID != 0) {
      // ???????????????timer
      this.stop();
    }
    timerID = setInterval(() => {
      that.timer()
    }, 1000) //??????1s????????????timer??????
  },

  stop: function() { //??????????????????
    clearInterval(timerID) //???????????????
    timerID=0;
    minute=0;
    second=0;
  },

  timer: function() { //????????????
    var that = this;
    // console.log(minute)
    // console.log(second)
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
    // console.log(minute)
    // console.log(second)
  },

  /**
   * ??????????????????--??????????????????
   */
  onHide() {
    this.stop();
  },

  /**
   * ??????????????????--??????????????????
   */
  onUnload() {
    this.stop();
  },

  /**
   * ??????????????????????????????--????????????????????????
   */
  onPullDownRefresh() {

  },

  /**
   * ???????????????????????????????????????
   */
  onReachBottom() {

  },

  /**
   * ???????????????????????????
   */
  onShareAppMessage() {

  }
})