<template>
	<view>
		
	<!-- 用户发布预约查看已被摄影师响应 -->
	<view class="u-page" v-if="orderMsg.orderWaitPhoer&&orderMsg.orderStatus==1">
		<view style="margin: 10px;">
			您在 {{orderMsg.time}} 发起的 {{orderMsg.type}}预约，以下摄影师表示了接受意向
		</view>
		<view style="margin-top: 25rpx;">
			对接摄影师：
				<u-cell
					:title="orderMsg.phoerName"
					:value="orderMsg.phoerIntro"
					center
					:label="orderMsg.phoerPhoneNumber"
					isLink
					:url="'/pages/photographer/phoer?phoerId='+orderMsg.phoerId"
				>
					<u-avatar
						slot="icon"
						shape="square"
						size="70"
						:src="orderMsg.phoerShowUrl"
						customStyle="margin: -3px 5px -3px 0"
						mode="aspectFill"
					></u-avatar>
				</u-cell>
		</view>
		<u-button
			type="primary"
			text="接受"
			customStyle="margin-bottom:20px"
			@click="verifyOrder(orderMsg._id)"
		></u-button>
		<u-button
			type="error"
			text="拒绝"
			@click="popupOpen('phoer')"
		></u-button>
	</view>
	<!-- 用户发查看在线摄影师的预约，摄影师未响应 -->
	<view class="u-page" v-else-if="orderMsg.orderWaitPhoer&&orderMsg.orderStatus==101">
		此预约已对以下摄影师发起，等待回应或点击联系ta吧
		<view style="margin-top: 25rpx;">
			对接摄影师：
				<u-cell
					:title="orderMsg.phoerName"
					:value="orderMsg.phoerIntro"
					center
					:label="orderMsg.phoerPhoneNumber"
					isLink
					:url="'/pages/photographer/phoer?phoerId='+orderMsg.phoerId"
				>
					<u-avatar
						slot="icon"
						shape="square"
						size="70"
						:src="orderMsg.phoerShowUrl"
						customStyle="margin: -3px 5px -3px 0"
						mode="aspectFill"
					></u-avatar>
				</u-cell>
				<u-button
					type="primary"
					text="联系ta"
					customStyle="margin-bottom:20px"
					@click="phoneCall(orderMsg.phoerPhoneNumber)"
				></u-button>
		</view>
	</view>
	<!-- 摄影师接单已发布的预约 用户待响应 -->
	<view class="u-page" v-else-if="orderMsg.phoerWaitOrder&&orderMsg.orderStatus==1">
		已对此订单发起接单预约，待下单方同意

		<u-cell
			:value="orderMsg.userInfo.name+'  '+orderMsg.userInfo.phoneNumber"
			:label="orderMsg.price+'元'"
			center
			isLink
			:url="'/pages/order/order?phoerChoiceOrder='+ encodeURIComponent(JSON.stringify(this.orderMsg)) "
		><!-- 获取item.userId数据并打包到phoerChoiceOrder发送到order页 1/3 -->
			<view
				slot="title"
				class="u-slot-title"
			>
				<text class="u-cell-text">{{orderMsg.type}}</text>
			</view>
		</u-cell>
		<u-button
			type="primary"
			text="联系ta"
			customStyle="margin-bottom:20px"
			@click="phoneCall(orderMsg.userInfo.phoneNumber)"
		></u-button>
	</view>
	<view class="u-page" v-else-if="orderMsg.phoerWaitOrder&&orderMsg.orderStatus==101">
		有用户通过查询在线摄影师对你预约了以下订单

			<u-cell
				:value="orderMsg.userInfo.name+'  '+orderMsg.userInfo.phoneNumber"
				:label="orderMsg.price+'元'"
				center
				isLink
				:url="'/pages/order/order?phoerChoiceOrder='+ encodeURIComponent(JSON.stringify(this.orderMsg)) "
			>
				<view
					slot="title"
					class="u-slot-title"
				>
					<text class="u-cell-text">{{orderMsg.type}}</text>
				</view>
			</u-cell>	
		<u-button
			type="primary"
			text="接受"
			customStyle="margin-bottom:20px"
			@click="takeOrder(orderMsg._id)"
		></u-button>
		<u-button
			type="error"
			text="拒绝"
			@click="popupOpen('order')"
		></u-button>
	</view>
	<!-- 拒绝信息弹出框 -->
	<u-popup
		mode="bottom"
		:show="showPopup"
		round="0"
		@close="popupClose()"
	>
		<view class="u-page">
			<view class="u-demo-block">
				<text class="u-demo-block__title">填写拒绝事由</text>
				<u-textarea
				v-model="rejectReason"
				placeholder="摄影师被拒绝也是会难受的,但提出建议可以让摄影师提升自我哦"
				confirmType="done"
				></u-textarea>
				<u-button
					text="确认拒绝"
					type="error"
					size="normal"
					@click="rejectOrder(orderMsg._id)"
					customStyle="margin-top:10rpx"
				></u-button>
			</view>
		</view>
	</u-popup>
	</view>
</template>

<script>
	let odb=uniCloud.database().collection('photography-order')
	let rejectedCharacterId=''
	export default {
		data() {
			return {
				showPopup:false,
				orderMsg:{},
				phoerMsg:{},
				rejectReason:'',
				orderWaitPhoer:false,
				phoerWaitOrder:false
			}
		},
		onLoad(e) {
			//orderList或fab过来的
			if(e.orderWaitPhoerMsg){
				console.log('orderWaitPhoerMsg');
				this.orderMsg=JSON.parse(decodeURIComponent(e.orderWaitPhoerMsg))
				console.log(this.orderMsg);
			}else if(e.phoerWaitOrderMsg){
				console.log('orderWaitPhoerMsg');
				this.orderMsg=JSON.parse(decodeURIComponent(e.phoerWaitOrderMsg))
				console.log(this.orderMsg);
			}
		},
		methods: {
			submit() {
				
			},
			popupOpen(rejectedCharacter) {
				// console.log('open');

				if(rejectedCharacter=='order'){
					rejectedCharacterId=this.orderMsg.order_push_clientid
				}else if(rejectedCharacter=='phoer'){
					rejectedCharacterId=this.orderMsg.phoer_push_clientid
				}
				this.showPopup = true
			},
			popupClose() {
				this.showPopup = false
				// console.log('close');
			},
			//接单
			verifyOrder(id){
				odb.doc(id).update({
					orderStatus:2,
					rejectReason:''
				}).then(res=>{
					// #ifde APP-PLUS
					uniCloud.callFunction({
						name:"push2",
						data:{
							cid:this.orderMsg.phoer_push_clientid,
							title:"预约成功",
							content:"你的预约被通过啦",
							payload:{
								fabShowText:"你有新的成功预约订单"
							}
						},
						success() {
							uni.showToast({
								title:"已通知摄影师",
								icon:"none"
							}),
							setTimeout(() => {uni.reLaunch({
								url:'/pages/home/home'
							})}, 1000)
						}
					})
					// #endi


				})
			},
			rejectOrder(id){
				odb.doc(id).update({
					orderStatus:0,
					rejectReason:this.rejectReason,
					rejectIds:this.orderMsg.rejectIds.concat(this.orderMsg.phoerId),
					phoerId:'',
					phoerPhoneNumber:'',
					phoerName:'',
					phoerIntro:'',
					phoerShowUrl:''
				}).then(res=>{
					// #ifde APP-PLUS
					uniCloud.callFunction({
						name:"push2",
						data:{
							cid:rejectedCharacterId,
							title:"订单拒绝响应",
							content:"有订单收到拒绝回应",
							payload:{
								fabShowText:"有订单收到拒绝回应",
								rejectReason:this.rejectReason
							}
						}
					})
					// #endi
					uni.showToast({
						title:"已向对方发送消息",
						icon:"none"
					}),
					setTimeout(() => uni.reLaunch({
						url:"/pages/home/home"
					}),1000)
				})
			},
			phoneCall(phoneNumber){
				uni.makePhoneCall({
					phoneNumber:phoneNumber
				})
			},
			takeOrder(id){
				odb.doc(id).update({
					orderStatus:2,
					rejectReason:''
				}).then(res=>{
					// #ifde APP-PLUS
					uniCloud.callFunction({
						name:"push2",
						data:{
							cid:this.orderMsg.order_push_clientid,
							title:"摄影师接受了你的预约",
							content:"请按时到场噢，如有问题请call ta",
							payload:{
								fabShowText:"摄影师"+this.orderMsg.phoerName+"接受了你的预约,请按时到场噢，如有问题请call ta",
								url:'/pages/order/order?orderMsg=',
								msg:{...this.orderMsg,orderStatus:2,rejectReason:''}
							}
						}
					})
					// #endi
					uni.showToast({
						title:"已向对方发送消息",
						icon:"none"
					}),
					setTimeout(() => uni.reLaunch({
						url:'/pages/home/home'
					}), 1000)
				}).catch((err) => {
					  uni.showModal({
					    content: err.message || '请求服务失败',
					    showCancel: false
					  })
					})
			}
		},
	}
</script>

<style lang="scss">
	.text-item {
		margin-right: 10px;
		flex: 1;
	}
	.u-slot-title {
		@include flex;
		flex-direction: row;
		align-items: center;
	}
	.u-cell-text {
		font-size: 15px;
		line-height: 22px;
		color: #303133;
		margin-right: 5px;
	}

</style>
