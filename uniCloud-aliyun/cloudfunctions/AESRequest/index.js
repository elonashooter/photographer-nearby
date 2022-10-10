'use strict';
// const aes=require('aestry')
const db = uniCloud.database()
const AES = require('aestry')
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const dbData={a:1,b:2,c:3}
	const endbData=encodeURIComponent(JSON.stringify(dbData)) 
	const returnData=AES.AES.encrypt(endbData,'1234567891234567','1234567891234567')
	//返回数据给客户端
	// console.log(aes.AES.encrypt(e.detail.value,'1234567891234567','1234567891234567'));

	return returnData
};
