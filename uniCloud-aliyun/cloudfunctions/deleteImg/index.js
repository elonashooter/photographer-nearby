'use strict';
exports.main = async (event, context) => {
	uniCloud.deleteFile({
		fileList:event,
		success(){
			console.log("删除成功");
		},
		fail(){
			console.log("删除失败");
		}
	})
	//event为客户端上传的参数
	
	//返回数据给客户端
	return
};
