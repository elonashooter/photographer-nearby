<template>
	<view>
		<view class="u-page">
			
		辞职须知：
		<u--text
			text='1.感谢陪伴'
			size='28'
			color='rgb(170, 0, 255)'
		></u--text>
		
		<text style="margin-top: 20px;">
		2.记得交接
		查询是否有在预约的订单，没有就可以润了。
		
		有的话交接完，因为辞职后作为摄影师的聊天记录会被清空
		
		3.辞职申请通过后，到时会需要重新登陆一次，
		就像你当时成为摄影师 要重新登陆一次一样</text>
		
		
		
		<button @click="popupOpen()" style="margin-top: 200px;">辞职</button>
		<u-popup
			mode="bottom"
			:show="showPopup"
			round="0"
			@close="popupClose()"
		>
			<view class="u-page">
				防误触提醒：是否确认辞职？
				<button @click="quitPhoer()">确认辞职</button>
			</view>
		</u-popup>
		
			
		</view>
	</view>
</template>

<script>
	let pdb=uniCloud.database().collection('photographer')
	let ppdb=uniCloud.database().collection('pre-photographer')
	export default {
		data() {
			return {
				phoerId:'',
				showPopup:false,
				chatHistory:[]
			};
		},

		onLoad(e) {
			if(e.phoerId){
				this.phoerId=e.phoerId
				console.log('this.phoerId:'+this.phoerId);
			}
		},
		onShow() {
			
		},
		onHide() {
			
		},
		
		methods: {
			quitPhoer(){
				let role=[]
				const uInfo=this.$store.state.user.info
				if(uInfo.role.includes('WP_manager')){
					role=['WP_manager']
				}else{
					role=[]
				}
				
				//清除作为摄影师的聊天记录
				uni.getStorage({
					key:'chatHistory',
					success: (res) => {
						this.chatHistory=res.data
						this.chatHistory=this.chatHistory.filter((x)=>x.phoerId!=uInfo._id)
						uni.setStorage({
							key:'chatHistory',
							data:this.chatHistory
						})
					}
				})
				ppdb.where({
					userId:this.phoerId
				}).update({
					WorkState:false
				})
				
				pdb.where({
					userId:this.phoerId
				}).update({
					WorkState:false,
					OnlineStatus:false
				}).then(res=>{
					this.$store.commit('user/character','order')
					uniCloud.database().collection('uni-id-users').doc(uInfo._id).update({
						role:role
					}).then(e=>{
						uni.reLaunch({
							url:'/pages/ucenter/login-page/pwd-login/pwd-login'
						})
					}).catch(e=>{
						uni.$u.toast('quit udb fail')
						console.log(e);
					})
				}).catch(e=>{
						uni.$u.toast('quit pdb fail')
						console.log(e);
					})
			},
			popupOpen(){
				this.showPopup=true
			},
			popupClose(){
				this.showPopup=false
			}
		},

	}
</script>

<style lang="scss">


</style>
