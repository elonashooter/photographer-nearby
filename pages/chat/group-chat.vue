<template>
	<view>
		<view>
			<groupMessageBox ref="messageBox"></groupMessageBox>
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
	import groupMessageBox from '@/components/messageBox/groupMessageBox.vue';
	import timeUtil from '@/fromDDchat/timeUtil.js';
	import inputBox from '@/components/inputBox/inputBox.vue';
	import {mapActions,mapGetters} from 'vuex';
	import $store from '@/store/index.js';
	export default {
		components:{
			inputBox: inputBox,
			groupMessageBox: groupMessageBox
		},
		data() {
			return {
				emoji: '',
				
			}
		},
		watch:{
			onlineArray(){
				this.showOnline()
			}
		},
		computed:{
			// ...mapGetters(['loginUserInfo', 'chattingGroupInfo','onlineArray'])
		},
		onPageScroll(h) {
			//this.$refs.inputBox.showDrawer = 0
			if(h.scrollTop===0){
				this.$refs.messageBox.getHistoryMsg()
			}
		},
		onUnload(){
			console.log('退出群聊天窗口')
			// $store.state.chattingGroupInfo = null
		},
		onLoad() {
			//console.log(this.chattingGroupInfo)
			
			///清空消息未读
			this.clearUnread()
			this.showOnline()
		},
		onNavigationBarButtonTap(e) {
			if(e.index === 0){
				// uni.navigateTo({
				// 	url:'/pages/info/group-info?id='+$store.state.chattingGroupInfo.sessionId
				// })
			}
		},
		methods: {
			//查看在线人数
			async showOnline(){
				
			},
			async clearUnread(){

			},
			 handleMessage(message){
				 
				 let m = {
					 senderId : this.loginUserInfo.id,
					 senderName : this.loginUserInfo.nickname,
					 avatar: this.loginUserInfo.avatar,
					 sendTime: message.time,
					 content: message.content,
					 messageType: message.type,
					 // groupId: this.chattingGroupInfo.sessionId
				 }
				 let msg = {
					 type: 'group-message',
					 data: m
				 }
				 uni.sendSocketMessage({
				 	data: JSON.stringify(msg),
					fail(res) {
						uni.showToast({
							icon:'error',
							title:'发送失败'
						})
					}
				 })
			 },
			 handleBottomHeight(height){
				 this.$refs.messageBox.setBottomHeigth(height)
			 },
			 handleKeyboradHeight(height){
				 // console.log(height)
				 this.$refs.messageBox.setKeyboardHeight(height)
			 }
		},
		created() {
			//console.log(timeUtil.getFormatTime(new Date()))
		
		}
	}
</script>

<style lang="scss">
	
