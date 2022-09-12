<template>
	<view>
		<view class="cate-section">
			<view class="cate-item">
				<image src="/static/temp/c6.png" @tap="getAllOrder()"></image>
				<text>检查订单</text>
			</view>
			<!-- 摄影师同时也是用户 -->
			<view class="cate-item">
				<image src="/static/temp/c1.png" @tap="toPhoerRList()"></image>
				<text>摄影师管理 </text>
			</view>
			<view class="cate-item">
				<image src="/static/temp/c8.png" @tap="toBusiness()"></image>
				<text>商家管理</text>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},

		onLoad() {
			
		},
		onShow() {
			
		},
		onHide() {
			
		},
		
		methods: {
			getAllOrder(){
				uni.navigateTo({
					url: '/pages/order/orderList?WP_manager=1'
				});
				// this.odb.get().then(res=>{
				// 	console.log("getOrder");
				// 	console.log(res);
				// })
			},
			toPhoerRList(){
				uni.navigateTo({
					url: '/pages/WP_manager/phoerRequestList'
				});
			},
			toBusiness(){
				uni.navigateTo({
					url: '/pages/WP_manager/business-request'
				});
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
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}

</style>
