<template>
	<view>
		<!-- <image src="../../static/11NoBgNoCut.png" class='img-background' mode="aspectFill"></image> -->
		<view>
			<messageBox ref="messageBox"
			 :chattingUserAvatar="chattingUserAvatar" 
			 :chattingUserCid="chattingUserCid" 
			 :chatMsg="chatMsg"
			 :loginUserCid="loginUserCid"
			 :loginUserAvatar='loginUserAvatar'></messageBox>
		</view>
		
		<view>
			<inputBox
			@sendMessage="handleMessage" 
			@bottomHeight="handleBottomHeight"
			@keyboradHeight="handleKeyboradHeight"
			 ref="inputBox"></inputBox>
		</view>
		
	</view>
</template>

<script>
	//component里messageBox和inputBox都是特化改过的，如果要改成新app所需 原文件在DDChat
	import timeUtil from '@/fromDDchat/timeUtil.js';
	import {mapGetters} from 'vuex';
	// import $store from '@/store/index.js';
	// import userRequest from '@/api/user.js';
	let msgDb=uniCloud.database().collection('chatMsg')
	let chatHistory=[]
	let msgIndex=-1
	export default {
		components:{
		},
		data() {
			return {
				emoji: '',
				index: 0,
				chattingUserCid:'',
				chattingUserAvatar:'',
				chattingUserName:'',
				chatMatchId:'',
				chatMsg:[],
				loginUserCid:'',
				loginUserAvatar:''
			}
		},
		// onUnload() { //路由返回是是不触发onUnload的
		// 	uni.$u.toast('addChatMsg');
		// 	this.setChatMsg()
		// 	// $store.state.chattingUserInfo = null
		// },
		onBackPress(){
			console.log('onBackPress');
			this.setChatMsg()
		},
		computed:{
			...mapGetters({
				lastMsg:'chat/lastMsg'
			})
		},
		watch:{
			lastMsg(lastMsg){
				if(this.chatMatchId==lastMsg.chatMatchId){
					console.log('match success');
					this.chatMsg.push(lastMsg)
					console.log(this.chatMsg);
				}
			}
		},
		onPageScroll(h) {
			this.$refs.inputBox.showDrawer = 0
			if(h.scrollTop==0){
				// this.$refs.messageBox.getWebHistoryMsg()
			}
		},
		onLoad(e) {	
			//摄影师界面点击聊天跳转过来
			// console.log('store chatHistory');
			// console.log(e);
			if(e.chattingUserCid){
				this.chattingUserAvatar=e.chattingUserAvatar
				this.chattingUserCid=e.chattingUserCid
				this.chattingUserName=e.chattingUserName
				this.chatMatchId=e.chatMatchId
			}
			if(e.loginUserAvatar){
				this.loginUserAvatar=e.loginUserAvatar
			}
			uni.getPushClientId({
				success: (e) => {
					// console.log(e);
					this.loginUserCid=e.cid
				}
			})
			// if(this.chattingUserInfo==null){
			// 	uni.switchTab({
			// 		url:'/pages/index/index'
			// 	})
			// 	return
			// }
			// ///清空消息未读
			// this.showOnline()
		},
		onShow() {
			uni.getStorage({
				key:'chatHistory',
				success: (res) => {
					chatHistory=res.data
					console.log(chatHistory);
					for(var i of chatHistory){
						if(i.chatMatchId){
							if(i.chatMatchId==this.chatMatchId){
								this.chatMsg=i.chatMsg
								msgIndex=chatHistory.indexOf(i)
								console.log('msgIndex is');
								console.log(msgIndex);
							}else{
								console.log('it is a new chatMatch');
							}
						}else{
							console.log('have not i.chatMatch yet');
						}
					}
				},
				fail: () => {
					console.log('chatHistory have not created');
				}
			})
		},
		methods: {
			//查看在线人数
			// showOnline(){
			// 	let tip = this.onlineArray.indexOf(this.chattingUserInfo.chattingUserCid)===-1?'离线':'在线'
			// 	uni.setNavigationBarTitle({
			// 		title:this.chattingUserInfo.name+'('+tip+')'
			// 	})
			// },
			// async clearUnread(){
			// 	let res = await userRequest.clearUnread({
			// 		myId: this.loginUserInfo.id,
			// 		friendId: this.chattingUserInfo.chattingUserCid
			// 	})
			// 	//console.log(res)
			// 	for(let i=0;i<$store.state.sessionList.length;i++){
			// 		if($store.state.sessionList[i].sessionId==this.chattingUserInfo.sessionId){
			// 			$store.state.sessionList[i].unread = 0
			// 			break
			// 		}
			// 	}
			// 	$store.dispatch('countUnreadMessage')
			// },
			 handleMessage(message){
				 //message传过来之前已处理部分 start
				 // let message = {
				 // 	messageType: 'text',
				 // 	// 格式 2022-10-22 15:30:37		不用时间戳，时间戳加减还得转化成这个格式
				 // 	sendTime: timeUtil.getFormatTime(new Date()),
				 // 	content: {text:this.text},
				 // 	senderName:this.$store.state.user.info.nickname
				 // }
				 // if(this.$store.state.user.info.avatar_file){
				 // 	message.senderAvatar=this.$store.state.user.info.avatar_file.url
				 // }
				 //message传过来之前已处理部分 end
				// console.log('message');
				// console.log(message);
				message.to_cid=this.chattingUserCid,
				message.chattingUserAvatar=this.chattingUserAvatar
				message.chattingUserName=this.chattingUserName
				message.from_cid=this.loginUserCid,
				message.chatMatchId=this.chatMatchId
				// msgDb.add(message).then(e=>{
				// 	console.log('添加成功');
				// }).catch(e=>{
				// 	console.log(e);
				// })
				message.isWithdrawn=0
				
				uniCloud.callFunction({
					name:'push-chatMsg',
					data:{
						cid:this.chattingUserCid,
						title:'isChatMsg',
						content:'测试',
						payload:message
					}
				}).then(e=>{
					console.log('chatMsg send success');
					this.chatMsg.push(message)
					this.pushMsgToCloud(message)
				})
				
			 },
			 setChatMsg(){
				if(msgIndex!==-1){
					chatHistory[msgIndex].chatMsg=this.chatMsg
					chatHistory[msgIndex].unReadNum=0
					console.log('setChatMsg');
					console.log(chatHistory);
					uni.setStorageSync('chatHistory',chatHistory)
				}else{
					uni.$u.toast('can not match setChatMsg')
				}

				// this.$store.commit('chat/updateChatMatch',chatHistory) //不明白为什么会出问题
			 },
			 pushMsgToCloud(message){
				 let uploadMsg={}
				 uploadMsg.chatMatchId=message.chatMatchId
				 uploadMsg.isWithdrawn=message.isWithdrawn
				 uploadMsg.from_cid=message.from_cid
				 uploadMsg.to_cid=message.to_cid
				 uploadMsg.sendTime=message.sendTime
				 uploadMsg.content=message.content
				 uploadMsg.messageType=message.messageType
				 uniCloud.database().collection('chatMsg').add(uploadMsg)
			 },
			 // getOnLineMsg(){
				 // 用不着 chat页面已经是双表查了
				 // uniCloud.database().collection('chatMsg').where({chatMatchId:this.chatMatchId}).get(res=>{
					//  this.chatMsg=res.result.data
				 // })
			 // },
			 handleBottomHeight(height){
				 this.$refs.messageBox.setBottomHeigth(height)
			 },
			 handleKeyboradHeight(height){
				 // console.log(height)
				 this.$refs.messageBox.setKeyboardHeight(height)
			 }
		},
		created() {
			uni.setNavigationBarTitle({
				title:this.chattingUserName
			})
			//console.log(timeUtil.getFormatTime(new Date()))
		},
		onHide() {
			console.log(this.chatMsg);
			this.setChatMsg()
		}
	}
</script>

<style>
/* 	.img-background{
		position: absolute;
		z-index: -1;
		height: 100%;
		width: 100%;
		
/* 		margin: 0 auto;
		left:0; right:0; 
		top: -1rpx; */
	/* } */ 
</style>
