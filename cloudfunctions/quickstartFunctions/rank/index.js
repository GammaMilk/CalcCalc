const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;

let getOpenid = function () {
  const ctx = cloud.getWXContext();
  return ctx.OPENID;
}

/**
 * 
 * @param {*} event 传入数据：{count: (Number)}
 * @param {*} context 
 */
exports.main = async (event, context) => {
  const add = event.add; // number
  const thisdb = db.collection('rank');

  var dbres = await thisdb.where({
    openid: getOpenid()
  }).get();

  if (dbres.data.length==0) {
    await thisdb.add({
      data:{
        openid:getOpenid(),
        score:0
      }
    })
    dbres = await thisdb.where({
      openid: getOpenid()
    }).get();
  }

  if (add==0) {
    return dbres.data[0].score;
  } else {
    // on updating db data
    var dbscore = dbres.data[0].score;
    if (dbscore+add<0) {
      await thisdb.where({openid:getOpenid()}).update({data:{score:0}})
      return 0;
    } else {
      await thisdb.where({openid:getOpenid()}).update({data:{score:_.inc(add)}})
      return dbscore+add;
    }
  }
};
