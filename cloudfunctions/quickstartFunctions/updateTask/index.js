const cloud = require('wx-server-sdk');
const createTask = require('../createTask/index');
const getTask = require('../getTask/index');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

/**
 * 
 * @param {*} event 传入数据：{count: (Number)}
 * @param {*} context 
 */
exports.main = async (event, context) => {
  await createTask.main(event,context);
  // 拉取上次信息
  var t = await getTask.main(event,context);
  // const openid = cloud.getWXContext().OPENID;
  console.log(event)
  const count = event.count;
  const date = new Date();
  const day = date.getDay();
  const openid = cloud.getWXContext().OPENID;
  console.log("DAY")
  console.log(day)
  switch (day) {
    case 1:
      t.x1 += count;
      t.x1l = date;
      break;
    case 2:
      t.x2 += count;
      t.x2l = date;
      break;
    case 3:
      t.x3 += count;
      t.x3l = date;
      break;
    case 4:
      t.x4 += count;
      t.x4l = date;
      break;
    case 5:
      t.x5 += count;
      t.x5l = date;
      break;
    case 6:
      t.x6 += count;
      t.x6l = date;
      break;
    case 7:
      t.x7 += count;
      t.x7l = date;
      break;
    default:
      break;
  }
  console.log(t)
  // 重新提交
  await db.collection('task').where({
    _openid: openid
  }).update({
    data: {
      x1: t.x1,
      x2: t.x2,
      x3: t.x3,
      x4: t.x4,
      x5: t.x5,
      x6: t.x6,
      x7: t.x7,
      x1l: t.x1l,
      x2l: t.x2l,
      x3l: t.x3l,
      x4l: t.x4l,
      x5l: t.x5l,
      x6l: t.x6l,
      x7l: t.x7l,
    }
  })
  return t;
};
