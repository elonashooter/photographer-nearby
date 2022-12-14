'use strict';
//尝试失败
let uniID = require('uni-id')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	uniID.resetPwd({
		password: event.password,
		"uid": loginBySmsRes.uid
	}).then(e=>{
		console.log(e);
	})
	//返回数据给客户端
	return event
};
