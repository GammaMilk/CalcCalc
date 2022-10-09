// pages/start/start.js
var getDig12AndLev = function(){
  // from cloud function to get user's digs and level

  // TODO: call cloud function

  // demo return:
  var d1 = Math.floor(Math.random() * 2) + 1;
  var d2 = Math.floor(Math.random() * 2) + 1;
  var level = 3;
  return [d1, d2, level];
}

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
    result:'0',
    normalOperatorArray: ['+', '-', '×', '÷'],
    easyOperatorArray:['+','-'],
    operator:(Math.random()).toFixed(0)==0?'+':'-',
    //operator:easyOperatorArray[1],
    submit:'submit',
    num1:(Math.random()*99).toFixed(0),
    num2:(100+Math.random()*99).toFixed(0),
    count:0
  },

// Merky balabala a lot which make me angry when I write this method.
  clickButton: function (event) {
    var res=parseInt(this.data.result);
    if(event.target.id=='submit'){      // check result after tap '√' 
      if(((this.data.operator=='+')&&(res-this.data.num1==this.data.num2))||((this.data.operator=='-')&&this.data.num2-this.data.num1==res)){ 
        this.setData({
          result:'0',
          operator:(Math.random()).toFixed(0)==0?'+':'-',
          num1:(Math.random()*99).toFixed(0),
          num2:(100+Math.random()*99).toFixed(0),
          count:this.data.count+1
        });
      }
    }
    else if (event.target.id == 'C') {  // AC once tap 'C'
      this.setData({
        result: '0'
      });
    }
    else if(event.target.id=='0'&&this.data.result=='0') {  // tap '0' when result equals to 0
      return;
    }
    else {   // tap a digit
      if(this.data.result!='0'){
        this.setData({
          result:this.data.result+event.target.id
        });
      }else {
        this.setData({
          result:event.target.id
        });
      }
    }
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