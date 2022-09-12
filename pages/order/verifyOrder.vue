<template>
	<view>
		
	<!-- 用户发布预约查看已被摄影师响应 -->
	<view class="u-page" v-if="orderMsg.orderWaitPhoer&&orderMsg.orderStatus==1">
		<view style="margin: 10px;">
			您在 {{orderMsg.time}} 发起的 {{orderMsg.type}}预约，以下摄影师表示了接受意向
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
			@click="popupOpen()"
		></u-button>
		
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
	</view>
	<!-- 用户发查看在线摄影师的预约，摄影师未响应 -->
	<view class="u-page" v-else-if="orderMsg.orderWaitPhoer&&orderMsg.orderStatus==101">
		此预约已对以下摄影师发起，等待回应或点击联系ta吧
		<view style="margin-top: 25rpx;">
			对接摄影师：
			<u-button
				type="primary"
				text="联系ta"
				customStyle="margin-bottom:20px"
				@click="phoneCall(orderMsg.phoerPhoneNumber)"
			></u-button>
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
	</view>
	<!-- 摄影师接单已发布的预约 用户待响应 -->
	<view class="u-page" v-else-if="orderMsg.phoerWaitOrder&&orderMsg.orderStatus==1">
		已对此订单发起接单预约，待下单方同意
		<u-button
			type="primary"
			text="联系ta"
			customStyle="margin-bottom:20px"
			@click="phoneCall(orderMsg.userInfo.phoneNumber)"
		></u-button>
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
	</view>
	<view class="u-page" v-else-if="orderMsg.phoerWaitOrder&&orderMsg.orderStatus==101">
		有用户通过查询在线摄影师对你预约了以下订单
		<u-button
			type="primary"
			text="接受"
			customStyle="margin-bottom:20px"
			@click="takeOrder(orderMsg._id)"
		></u-button>
		<u-button
			type="error"
			text="拒绝"
			@click="popupOpen()"
		></u-button>
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
	</view>
	<!-- 拒绝信息弹出框 -->
	<u-popup
		mode="bottom"
		:show="showPopup"
		round="0"
		@close="popupClose()"
		@open="popupOpen()"
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
			//orderList过来的
			if(e.orderWaitPhoerMsg){
				this.orderMsg=JSON.parse(decodeURIComponent(e.orderWaitPhoerMsg))
				// console.log(this.orderMsg);
			}else if(e.phoerWaitOrderMsg){
				this.orderMsg=JSON.parse(decodeURIComponent(e.phoerWaitOrderMsg))
			}
			//fab过来的
			else if(e.bothMsg){
				let bothMsg=JSON.parse(decodeURIComponent(e.bothMsg))
				this.orderMsg=bothMsg.orderMsg
				this.phoerMsg=bothMsg.phoerMsg
			}
		},
		methods: {
			submit() {
				
			},
			popupOpen() {
				// console.log('open');
				this.showPopup = true
			},
			popupClose() {
				this.showPopup = false
				// console.log('close');
			},
			//接单
			verifyOrder(id){
				this.odb.doc(id).update({
					orderStatus:2,
					rejectReason:''
				}).then(res=>{
					uni.showToast({
						title:"通过完成，感谢支持",
						icon:"none"
					}),
					setTimeout(() => uni.navigateBack({
						delta: 2
					}), 1000)
				})
			},
			rejectOrder(id){
				this.odb.doc(id).update({
					orderStatus:0,
					rejectReason:this.rejectReason,
					phoerId:'',
					phoerPhoneNumber:'',
					phoerName:'',
					phoerIntro:'',
					phoerShowUrl:''
				}).then(res=>{
					// uniCloud.callFunction({
					// 	name:"push2",
					// 	data:{
					// 		uid:this.agreed.phoerId,
					// 		title:"订单拒绝响应",
					// 		content:"以下订单拒绝了你的响应",
					// 		payload:{
					// 			fabShowText:"以下"+this.agreed.type+"订单拒绝了你的响应",
					// 			url:'/pages/order/verifyOrder',
					// 			phoerMsg:this.phoerMsg,
					// 			orderMsg:this.agreed
					// 		}
					// 	}
					// })
					uni.showToast({
						title:"已向对方发送消息",
						icon:"none"
					}),
					setTimeout(() => uni.navigateBack({
						delta: 2
					}), 1000)
				})
			},
			phoneCall(phoneNumber){
				uni.makePhoneCall({
					phoneNumber:phoneNumber
				})
			},
			takeOrder(id){
				this.odb.doc(id).update({
					orderStatus:2,
					rejectReason:''
				}).then(res=>{
					uni.showToast({
						title:"已向对方发送消息",
						icon:"none"
					}),
					setTimeout(() => uni.navigateBack({
						delta: 2
					}), 1000)
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

</style>
