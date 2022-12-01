<script>
	import initApp from '@/common/appInit.js';
	import openApp from '@/common/openApp.js';
	import checkIsAgree from '@/pages/uni-agree/utils/uni-agree.js';
	import uView from '@/uni_modules/uview-ui';
	export default {
		globalData: {
			searchText: '',
			appVersion: {},
			config: {},
			$i18n: {},
			$t: {}
		},
		onLaunch: function() {
			// #ifde APP-PLUS
			uni.onPushMessage((res) => {
				//	1用于接收聊天信息  2用于接收摄影师相关信息
				// 摄影师通知的4种情况  摄影师接单 摄影师接单得到确认  用户预约  用户预约得到确认
				console.log(res);
				let payload = res.data.payload
				if(res.data.title=='isChatMsg'){
					console.log("isChatMsg");
					// home页面右上角的红点  因为是练习所以store+computed+watch/$emit+$on两种监听方式都尝试一下  emit的方式不知道为什么不行
					this.$store.commit('chat/setRedDot',true) //待定 可能有问题要换成getCurrentPages()[0].$vm.$store
					uni.getStorage({
						key:'chatHistory',
						success(res) {
							let chatHistory=res.data
							for(var i of chatHistory){
								if(i.chatMatchId==payload.chatMatchId){
									i.unReadNum+=1
									chatHistory[chatHistory.indexOf(i)].chatMsg.push(payload)
								}
							}
							uni.setStorageSync('chatHistory',chatHistory)
						}
					})
					this.$store.commit('chat/lastMsg',payload)
					this.$store.commit('chat/addChatHistory',{chatMatchId:payload.chatMatchId,chatMsg:payload})
					
					// uni.$emit('updateChatMatch',res.data.payload)
					// uni.$emit('updateChatMsg',res.data.payload)
				}else if(res.data.title=='addChatMatch'){
					console.log('addChatMatch');
					this.$store.commit('chat/setRedDot',true)
					this.$store.commit('chat/addChatMatch',payload)
					let chatHistory = uni.getStorageSync('chatHistory') || [];
					chatHistory.push(payload)
					uni.setStorageSync("chatHistory",chatHistory)
				}
				//摄影师相关信息
				else{
					uni.navigateTo({
						url:"/pages/order/fab?bothMsg="+encodeURIComponent(JSON.stringify(res.data))
					})
				}
				// uni.createPushMessage({
				// 	title:res.data.title,
				// 	content:res.data.content,
				// 	sound:'system'
				// })
			});

			// #endi
			uni.getStorage({
				key:'chatHistory',
				success() {
					
				},
				fail() {
					uni.setStorage({
						key:'chatHistory',
						data:[]
					})
				}
			})
			console.log('App Launch')
			
			this.globalData.$i18n = this.$i18n
			this.globalData.$t = str => this.$t(str)

			initApp();
			
			// #ifdef H5
				openApp() //创建在h5端全局悬浮引导用户下载app的功能
			// #endif


		},
		onShow: function() {
			console.log('App Show')
			//遮罩效果测试
			// uni.navigateTo({
			// 	url:"/pages/order/fab?bothMsg="+encodeURIComponent(JSON.stringify({
			// 					cid:this.$store.state.user.info._id,
			// 					title:"申请通过",
			// 					content:"你现在是简拍的摄影师了！",
			// 					payload:{
			// 						fabShowText:"申请通过,重新登陆一次你就是简拍的摄影师了",
			// 						CharacterChange:1
			// 					}}))
			// })
			//推送监听end
		},
		onHide: function() {
			// if(this.$store.state.user.OnlineStatus){
			// 	uni.$u.toast('请摄影师下线后再退出')
			// } 
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "common/demo.scss";
</style>
