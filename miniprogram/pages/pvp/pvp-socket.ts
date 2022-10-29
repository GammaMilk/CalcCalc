function getRoomId(openid:String, nickName: String) : String{
  var ret:String = '';
  var sTask = wx.connectSocket({
    url: "wss://api.jsnsl.cn/ws/hall"
  });
  sTask.onOpen(function onOpen(){
    sTask.send({
      data:JSON.stringify({openid:openid,nickName:nickName})
    })
  })
  return ret;
}