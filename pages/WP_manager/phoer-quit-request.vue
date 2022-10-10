<template>
	<view>
		<view class="cate-section">
		辞职须知：
		1.感谢陪伴
		
		2.记得交接
		
		查询是否有在预约的订单，无则可删。
		有，则提示先完成或交接再删
		删除摄影师离职的在预约订单
		
		
		<button @click="popupOpen()">辞职</button>
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
