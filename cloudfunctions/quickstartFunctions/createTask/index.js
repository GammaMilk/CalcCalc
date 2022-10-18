const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const dbres = await db.collection('task').where({
    _openid:openid
  }).get();
  if (dbres.data.length == 0) {
    // add user here
    await db.collection('task').add({
      data:{
        _openid:openid,
        x1:0,
        x2:0,
        x3:0,
        x4:0,
        x5:0,
        x6:0,
        x7:0,
        x1l:new Date(),
        x2l:new Date(),
        x3l:new Date(),
        x4l:new Date(),
        x5l:new Date(),
        x6l:new Date(),
        x7l:new Date(),
      }
    });
    return 0;
  }
  return -1;
};
