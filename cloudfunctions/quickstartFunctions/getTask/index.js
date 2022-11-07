const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  console.log(openid)
  // 拉去信息
  const dbres = await db.collection('task').where({
    _openid:openid
  }).get()
  const now = new Date();
  var d = dbres.data[0];
  var unchanged = true;
  let sevendays = 7*24*60*60*1000;
  var lastKiss = new Date(now - sevendays)
  console.log("lastkiss:",lastKiss)
  if(d.x1l < lastKiss) {
    d.x1=0;
    unchanged = false;
  }
  if (d.x2l < lastKiss) {
    d.x2=0;
    unchanged = false;
  }
  if (d.x3l < lastKiss) {
    d.x3=0;
    unchanged = false;
  }
  if (d.x4l < lastKiss) {
    d.x4=0;
    unchanged = false;
  }
  if (d.x5l < lastKiss) {
    d.x5=0;
    unchanged = false;
  }
  if (d.x6l < lastKiss) {
    d.x6=0;
    unchanged = false;
  }
  if (d.x7l < lastKiss) {
    d.x7=0;
    unchanged = false;
  }
  // 重新提交
  if(!unchanged) {
    await db.collection('task').where({
      _openid:openid
    }).update({
      data: {
        x1: d.x1,
        x2: d.x2,
        x3: d.x3,
        x4: d.x4,
        x5: d.x5,
        x6: d.x6,
        x7: d.x7,
        x1l: d.x1==0?now:d.x1l,
        x2l: d.x2==0?now:d.x2l,
        x3l: d.x3==0?now:d.x3l,
        x4l: d.x4==0?now:d.x4l,
        x5l: d.x5==0?now:d.x5l,
        x6l: d.x6==0?now:d.x6l,
        x7l: d.x7==0?now:d.x7l,
      }
    });
  }
  return d;
};
