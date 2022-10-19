const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
const ctx = cloud.getWXContext();
var openid = ctx.OPENID; 

async function newMatch(e,c) {
  // check if the last match is empty 
  // first we should get the last match,
  // if the match has only 1p, then use this
  openid = cloud.getWXContext().OPENID;
  if (openid == undefined) {
    console.error("NO OPENID")
    return {
      error: cloud.getWXContext()
    }
  }
  
  // get user nickname
  const ures = await db.collection('userlist').where({_openid:openid}).get();
  const nickName = ures.data[0].nickName;
  const visc = db.collection('vslist');
  const vu = db.collection('vsu');
  var p = 'p';
  var roomid = -1;
  let rLast = await visc.orderBy('roomid','desc').limit(1).get(); // r means 'record'
  console.log(rLast);
  if (rLast.data.length==0 || rLast.data[0].stat=='waiting') {
    // join this game
    roomid = rLast.data[0].roomid;
    p='p2';
    console.log(roomid)
    await visc.where({roomid:roomid}).update({data:{stat:'doing'}})
    await vu.where({roomid:roomid}).update({data:{p2:nickName}})
    // await visc.add({data:{
    //   roomid:roomid,stat:'doing',count:20,result:{time:0,p1count:0,p2count:0}
    // }})
  } else {
    // new game
    p = 'p1';
    roomid = rLast.data[0].roomid+1;
    await visc.add({
      data:{
        roomid:roomid,stat:'waiting',count:20,result:{time:0,p1count:0,p2count:0}
      }
    })
    await vu.add({data:{roomid:roomid,p1:nickName,p2:''}});
  }
  return {
    error:'',
    roomid: roomid,
    p: p
  }
}
async function endMatch(e,c) {
  openid = cloud.getWXContext().OPENID;
  
}
async function addRecord(roomid, player) {
  openid = cloud.getWXContext().OPENID;
  const visc = db.collection('vslist');
  if (player=='p1') {
    await visc.where({roomid:roomid}).update({data:{stat:'updating',result:{p1count:_.inc(1)}}})
  } else {
    await visc.where({roomid:roomid}).update({data:{stat:'updating',result:{p2count:_.inc(1)}}})
  }
}
async function another(roomid, selfp) {
  openid = cloud.getWXContext().OPENID;
  const udb = db.collection('userlist');
  const vu = db.collection('vsu');
  const p = selfp=='p1'?'p2':'p1';
  // 去查询p2的
  // SELECT nickName FROM userlist WHERE _openid IN (SELECT p2 FROM vslist WHERE roomid=%1)
  const vures = await vu.where({roomid:roomid}).get();
  console.log(vures);
  var nickName;
  if (p=='p1') nickName = vures.data[0].p1;
  else nickName = vures.data[0].p2;
  return nickName;
}
// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  openid = cloud.getWXContext().OPENID;
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