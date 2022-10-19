const getOpenId = require('./getOpenId/index');
const getTask = require('./getTask/index')
const updateTask = require('./updateTask/index')
const createTask = require('./createTask/index')
const matchMgr = require('./matchMgr/index')


// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
    case 'getTask':
      return await getTask.main(event,context);
    case 'updateTask':
      return await updateTask.main(event,context);
    case 'createTask':
      return await createTask.main(event,context);
    case 'matchMgr':
      return await matchMgr.main(event, context);
  }
};
