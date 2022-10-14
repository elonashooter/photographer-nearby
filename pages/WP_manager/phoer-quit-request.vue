<template>
	<view class="u-page">
		
<!-- 		<u-cell
			:title="agreed.phoerName"
			:value="agreed.phoerIntro"
			center
			:label="agreed.phoerPhoneNumber"
		>
			<u-avatar
				slot="icon"
				shape="square"
				size="70"
				:src="agreed.phoerShowUrl"
				customStyle="margin: -3px 5px -3px 0"
				mode="aspectFill"
			></u-avatar>
		</u-cell> -->
		
		
		<button @click="popupOpen()" style="margin-top: 200px;">let him\her go</button>
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
				showPopup:false
			};
		},

		onLoad(e) {
			if(e.phoerId){
				this.phoerId=e.phoerId
			}
		},
		onShow() {
			
		},
		onHide() {
			
		},
		
		methods: {
			quitPhoer(){
				pdb.where({
					userId:this.phoerId
				}).update({
					WorkState:false
				}).then(res=>{
					uniCloud.database().collection('uni-id-users').doc(this.phoerId).update({
						role:[]
					}).then(res=>{
						uni.showToast({
							title:"完成",
							icon:"none"
						})
						setTimeout(() => uni.reLaunch({
							url:"/pages/home/home"
						}), 500)
					})
				})
				this.$store.commit(['user/character'],'order')
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
.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30upx 22upx; 
		background: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
		}
	}

</style>
