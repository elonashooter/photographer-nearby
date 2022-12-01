// 开发文档：https://uniapp.dcloud.io/uniCloud/jql.html#action  结果用到了联表查询 暂时不用此action
module.exports = {
	before: async (state, event) => {
		
	},
	after: async (state, event, error, result) => {
		if (error) {
			throw error
		}
		if(result.data.length>0){
			for(let i in result.data){
				result.data.chatMatchId=result.data._id
			}
			
		}
		return result
	}
}