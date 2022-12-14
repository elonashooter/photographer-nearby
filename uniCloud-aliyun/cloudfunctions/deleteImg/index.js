'use strict';
exports.main = async (event, context) => {

	let result = await uniCloud.deleteFile({
		fileList:event.fileList
	})
	console.log(result);
	
	//event为客户端上传的参数
	
	//返回数据给客户端
	return result
};
