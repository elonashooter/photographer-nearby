<template>
	<view >
		<view class="cate-section" v-if="WP_manager">
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
			<view class="cate-item">
				<u-icon name='star' size="40" @tap="phoerConfirm()"></u-icon>
				<text>平台认证</text>
			</view>
		</view>
		<view style="display: flex;flex-direction: row;">
			<button @click="clearData()">清空当前用户数据</button>
			<!-- <button @click="clearHistoryImg()">清空历史图片</button>
			 -->
			 <button @click="resetChatMatch()">重置聊天信息</button>
		</view>

		

	</view>
</template>

<script>
	const db = uniCloud.database()
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
			phoerConfirm(){
				uni.navigateTo({
					url:'/pages/WP_manager/phoerConfirm'
				})
			},
			clearData(){
				//删图
				let photos=[]
				let Msg={}
				db.collection('photographer').where({userId:this.$store.state.user.info._id}).get().then(res=>{
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
				// db.collection('pre-photographer').where({
				// 	create_time:dbCmd.gt(1664273248)
				// }).remove()
				// db.collection('pre-photographer').where("create_time>1664273248").remove()

				
			},
			threeDelete(){
				let did=this.$store.state.user.info._id
				db.collection('pre-photographer').where({userId:did}).remove()
				db.collection('photographer').where({userId:did}).remove()
				db.collection('uni-id-users').doc(did).update({
					role:[]
				})
			},
			clearHistoryImg(){
				uniCloud.callFunction({
					name:'clearHistoryImg',
					data:''
				})
			},
			resetChatMatch(){
				db.collection('chatMatch').where({}).remove()
				db.collection('chatMsg').where({}).remove()
				db.collection('photographer').where({}).update({
					workedUserId:[]
				})
				uni.removeStorageSync('chatHistory')
				uni.$u.toast('1')
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
