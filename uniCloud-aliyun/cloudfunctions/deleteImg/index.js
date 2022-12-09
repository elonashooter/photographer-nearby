'use strict';
exports.main = async (event, context) => {
	let returnData = {}
	uniCloud.deleteFile({
		fileList:event.fileList

	}).then(e=>{
		console.log(e);
		returnData=e
	}).catch(e=>{
		console.log(e);
		returnData=e
	})
	//event为客户端上传的参数
	
	//返回数据给客户端
	return returnData
};
