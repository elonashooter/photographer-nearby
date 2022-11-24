<template>
	<view v-if="WP_manager">
		<view class="cate-section" >
			<view class="cate-item">
				<u-icon name='file-text' size="40" @tap="getAllOrder()"></u-icon>
				<text>检查订单</text>
			</view>
			<!-- 摄影师同时也是用户 -->
			<view class="cate-item">
				<u-icon name='man-add' size="40" @tap="toPhoerRList()"></u-icon>
				<text>摄影师管理 </text>
			</view>
			<view class="cate-item">
				<u-icon name='scan' size="40" @tap="toBusiness()"></u-icon>
				<text>二维码</text>
			</view>
			<view class="cate-item">
				<u-icon name='thumb-up' size="20" @tap="getFeedBack()"></u-icon>
				<u-icon name='thumb-down' size="20" @tap="getFeedBack()"></u-icon>
				<text>反馈收集</text>
			</view>
		</view>
		
		<button @click="clearData()">清空当前用户数据</button>

	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {

			};
		},
		computed:{
			...mapGetters({
				WP_manager:'user/WP_manager'
			})
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
			getFeedBack(){
				uni.navigateTo({
					url:'/pages/WP_manager/feedBack'
				})
			},
			toPhoerRList(){
				uni.navigateTo({
					url: '/pages/WP_manager/phoerRequestList'
				});
			},
			toBusiness(){
				uni.navigateTo({
					url: '/pages/ucenter/about/about'
				});
			},
			clearData(){
				//删图
				let photos=[]
				let Msg={}
				uniCloud.database().collection('photographer').where({userId:this.$store.state.user.info._id}).get().then(res=>{
					if(res.length>0){
						Msg=res.data[res.data.length-1]
						photos=Msg.phoerShowHistory.concat(Msg.symbolsHistory)
						uniCloud.callFunction({
							name:"deleteImg",
							data:photos,
							success: () => {
								console.log("图片删除完成");
								this.threeDelete()
							}
						})
					}else{
						this.threeDelete()
					}
				})
				// uniCloud.database().collection('pre-photographer').where({
				// 	create_time:dbCmd.gt(1664273248)
				// }).remove()
				// uniCloud.database().collection('pre-photographer').where("create_time>1664273248").remove()

				
			},
			threeDelete(){
				let did=this.$store.state.user.info._id
				uniCloud.database().collection('pre-photographer').where({userId:did}).remove()
				uniCloud.database().collection('photographer').where({userId:did}).remove()
				uniCloud.database().collection('uni-id-users').doc(did).update({
					role:[]
				})
			}
			
		},

	}
</script>

<style lang="scss">
.cate-section {
		display: flex;
		flex-direction: row;
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
