<template>
	<view>
		<view style="display: flex;">
			<text style="flex: 1;">待定搜索栏</text>
			<button style='flex: 1;' @click="getChatMatch()">刷新</button>
		</view>
		
		
		<msgGroup :chatGroup="chatGroup"></msgGroup>
	</view>
</template>

<script>
	import msgGroup from './msgGroup'
	import{mapGetters} from 'vuex'
	const db = uniCloud.database();
	export default {
		components:{msgGroup},
		 data() {
		    return {
				chatGroup:[]
		    }
		},
		onLoad() {
			

		},
		computed:{
			...mapGetters({
				chatHistory:'chat/chatHistory',
				lastMsg:'chat/lastMsg'
			})  //待改成存store
		},
		watch:{
			chatHistory(e){
				//App.vue的 addChatHistory不触发是为什么 —— 需要深度监听 但很消耗性能
				console.log('watch chatHistory');
				console.log(e);//chatHistory本身
				this.chatGroup=this.chatHistory  //尝试换深度拷贝的方法避免mutation报错
			},
			lastMsg(e){
				console.log('watch lastMsg');
				// console.log(e);
				for(var i in this.chatGroup){
					if(this.chatGroup[i].chatMatchId==this.lastMsg.chatMatchId){
						this.chatGroup[i].unReadNum+=1  //在app.vue存本地 
						console.log(this.chatGroup[i]);
						this.chatGroup[i].chatMsg.push(e)
					}
				}
			}
		},
		methods:{
			// 获取本地聊天缓存
			getChatData(){
				this.chatGroup = uni.getStorageSync('chatHistory') || [];
				console.log('chatGroup');
				console.log(this.chatGroup);
			},
			// 获取云数据库的聊天记录
			getChatMatch(){
				let uid =this.$store.state.user.info._id
				//要用到gettemp  联查尝试
				const chatMatch=db.collection('chatMatch').where(`phoerId=="${uid}"||userId=="${uid}"`).getTemp()
				db.collection(chatMatch,'chatMsg').get().then(e=>{//预期数据结构与chat.js中的数据一致
					// console.log('联表查询数据')
					// console.log(e);
					if(e.result.data.length>0){
						// 用action返回对应chatMatchId的chatMsg
						let data=e.result.data
						for(var i of data){
							i.chatMsg=i._id.chatMsg
							i._id=i._id._value
							i.chatMatchId=i._id //可无视 重复是为了贴合本地储存字段结构
						}
						//储存到本地
						this.chatGroup=data
						uni.setStorage({
							key:'chatHistory',
							data:this.chatGroup
						})
						// console.log('chatGroup');
						// console.log(this.chatGroup);
					}else{
						uni.$u.toast('暂无记录')
					}
				}).catch(e=>{
					console.log(e);
				})
			}
		},
		onHide() {
			this.$store.commit('chat/setRedDot',false)
		},
		onShow() {
			// console.log(this.$store.state.chat.chatHistory);
			this.getChatData()
		},
		
		
	}
</script>

<style>

</style>