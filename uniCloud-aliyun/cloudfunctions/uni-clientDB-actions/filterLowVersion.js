// 开发文档：https://uniapp.dcloud.io/uniCloud/jql.html#action
//此方法是针对 phoerList页面获取摄影师的低版本过滤，0.613版本起返回的数据将加密，0.613之前的版本没加密所以要拒绝返回数据
let LowVersion=false
let AES=require('aestry')
module.exports = {
	before: async (state, event) => {
		console.log('event');
		console.log(event);
		let param=state.command.getParam({name:'where',index: 0})
		// param  [{"OnlineStatus":true,"version":"H5OrMP"}]
		let ver= param[0].version
		console.log('ver');
		console.log(ver);
		if(ver == 'H5OrMP' || ver>0.612){  //0.612是不安全的最高级版本，之后的版本都相对安全
			console.log('before pass');
			LowVersion=false
		}else{
			console.log('before fail');
			LowVersion=true
		}
		
		delete param[0].version

		state.command.setParam({name:'where',index: 0, param: param})

	},
	after: async (state, event, error, result) => {
		console.log("after");
		console.log(result);
		result.data=encodeURIComponent(JSON.stringify(result.data))
		result.data=AES.AES.encrypt(result.data,'1234567891234567','1234567891234567')
		if(LowVersion){
			result.data=''
		}
		if (error) {
			throw error
		}
		return result
	}
}