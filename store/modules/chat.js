// 上次启动时的聊天信息
let chatHistory = uni.getStorageSync('chatHistory') || [];
// chatHistory结构:
// {
// 	chatMatchId:String
// 	phoerId:String
// 	phoerAvatar:String
// 	phoerName:String
// 	phoerPushId:String
// 	userName:String
// 	userId:String
// 	userAvatar:String
// 	userPushId:String
// 	chatMsg:array
// }
let state = {
		//是否已经登录
		homeRedDot: false,
		//用户信息
		chatHistory: chatHistory,
		lastMsg:{}
	},
	getters = {
		chatHistory(state) {
			return state.chatHistory;
		},
		homeRedDot(state){
			return state.homeRedDot;
		},
		lastMsg(state){
			return state.lastMsg
		}
		
	},
	mutations = {
		setRedDot(state,bool) {
			state.homeRedDot=bool
		},
		//主要为了触发未读角标
		addChatHistory(state,Obj) {  
			for(var i of state.chatHistory){
				if(i.chatMatchId==Obj.chatMatchId){
					state.chatHistory[state.chatHistory.indexOf(i)].chatMsg.push(Obj.chatMsg)
				}
			}	
		},
		
		addChatMatch(state,chatMatchData){
			state.chatHistory.push(chatMatchData)
		},
		updateChatMatch(state,chatMatchData){
			state.chatHistory=chatMatchData
		},
		lastMsg(state,lastMsg){
			state.lastMsg=lastMsg
		}
		
		
	},
	actions = {

	}
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions
}