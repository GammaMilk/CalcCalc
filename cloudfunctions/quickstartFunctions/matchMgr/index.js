const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
const openId = cloud.getWXContext().OPENID;

async function newMatch(e,c) {
  // check if the last match is empty
  // first we should get the last match,
  // if the match has only 1p, then use this
  if (!openId) {
    console.error("NO OPENID")
  }
  const visc = db.collection('vslist');
  const vb = db.collection('vsboard');
  var p = 'p';
  var roomid = -1;
  let rLast = await visc.orderBy('roomid','desc').limit(1).get(); // r means 'record'
  console.log(rLast);
  if (rLast.data.length==0 || rLast.data[0].stat=='waiting') {
    // join this game
    roomid = rLast.data[0].roomid;
    p='p2';
    console.log(roomid)
    await visc.where({roomid:roomid}).update({data:{stat:'doing',p2:openId}})
    // await visc.add({data:{
    //   roomid:roomid,stat:'doing',count:20,result:{time:0,p1count:0,p2count:0}
    // }})
  } else {
    // new game
    p = 'p1';
    roomid = rLast.data[0].roomid+1;
    await visc.add({
      data:{
        roomid:roomid,stat:'waiting',count:20,result:{time:0,p1count:0,p2count:0},p1:openId,p2:''
      }
    })
    await vb.add({data:{roomid:roomid,p1count:0,p2count:0}});
  }
  return {
    roomid: roomid,
    p: p
  }
}
async function endMatch(e,c) {
  
}
async function addRecord(roomid, player) {
  const vb = db.collection('vsboard');
  const visc = db.collection('vslist');
  if (player=='p1') {
    await visc.where({roomid:roomid}).update({data:{stat:'updating',result:{p1count:_.inc(1)}}})
  } else {
    await visc.where({roomid:roomid}).update({data:{stat:'updating',result:{p2count:_.inc(1)}}})
  }
}
async function another(roomid, selfp) {
  const udb = db.collection('userlist');
  const p = selfp=='p1'?'p2':'p1';
  // 去查询p2的
  // SELECT nickName FROM userlist WHERE _openid IN (SELECT p2 FROM vslist WHERE roomid=%1)
  const ures = await udb.aggregate().lookup({
    from: 'vslist',
    localField: '_openid',
    foreignField: p,
    as: 'huster'
  }).match({
    huster:{
      roomid:roomid
    }
  })
  .end()
  console.log(ures);
  return ures;
}
// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  switch (event.matchOption) {
    case 'new':
      return await newMatch(event, context);
    case 'end':
      return await endMatch(event, context);
    case 'add':
      let roomid = event.roomid; // number roomid
      let p = event.p; // string 'p1' or 'p2'
      return await addRecord(roomid,p);
    case 'another':
      // number roomid
      // string 'p1' or 'p2'
      return await another(event.roomid,event.p);
    default:
      break;
  }
}