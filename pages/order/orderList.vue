<template>
	<view class="u-page">
		<u-empty
			v-if="empty"
			mode="message"
			text="暂无数据"
		></u-empty>
		<u-list>
			<u-list-item
				v-for="(item, index) in orderList"
				:key="index"
			>
			<!-- 摄影师看到的 -->
				<u-cell
					:value="item.userInfo.name+'  '+item.userInfo.phoneNumber"
					:label="item.price+'元'"
					center
					isLink
					@click="getItemAndGo(item)" 
				><!-- 获取item.userId数据并打包到phoerChoiceOrder发送到order页 1/3 -->
					<view
						slot="title"
						class="u-slot-title"
					>
						<text class="u-cell-text" v-if="item.orderStatus===0">{{item.type}}</text>
						<text class="u-cell-text" v-else>{{item.type+":"+item.phoerName}}</text>
						<u-tag
							text="已发起"
							size="mini"
							type="warning"
							v-if="item.orderStatus===0"
						>
						</u-tag>
						<u-tag
							text="待下单方确认"
							size="mini"
							type="primary"
							v-if="item.orderStatus===1"
						>
						</u-tag>
						<u-tag
							text="待摄影方确认"
							size="mini"
							type="primary"
							v-if="item.orderStatus===101"
						>
						</u-tag>
						<u-tag
							text="约拍进行中"
							size="mini"
							type="error"
							plain
							v-if="item.orderStatus===2"
						>
						</u-tag>
						<u-tag
							text="已完成"
							size="mini"
							type="success"
							v-if="item.orderStatus===3"
						>
						</u-tag>
					</view>
				</u-cell>
				
			</u-list-item>
			
		</u-list>
	</view>
</template>

<script>
	let odb=uniCloud.database().collection('photography-order')

	export default {
		data() {
			return {
				orderList: [],
				empty:false,
				orderId:'',
				phoerId:'',
				phoerChoiceOrder:{},
				url:'',
				WP_manager:false
			}
		},
		onShow() {

		},
		onLoad(e) {
			if(e.WP_manager){
				this.WPgetOrder()
				this.WP_manager=true
			}
			else if(e.orderId){
				//用户查看'我的预约'
				this.orderId=e.orderId //用于getItemAndGo判断身份为“用户查看我的预约”
				this.getOrderListByOrderId(e.orderId)
			}else if(e.phoerId){
				//摄影师查看'我接的单'
				this.phoerId=e.phoerId
				this.getOrderListByPhoerId(e.phoerId)
			}else if(e.phoerChoiceOrder){
				//摄影师查看所有订单
				//获取item.userId数据并打包到phoerChoiceOrder发送到order页 2/3 
				this.phoerChoiceOrder.phoerId=this.$store.state.user.info._id
				this.getAllOrder()
			}
		},
		methods: {
			getItemAndGo(item){
				console.log('getItemId success');
				if(this.orderId){
					//用户查单
					if(item.orderStatus===0||item.orderStatus==2||item.orderStatus==3){
						this.url='/pages/order/order?orderMsg='+ encodeURIComponent(JSON.stringify(item)) 
					}else if(item.orderStatus===1||item.orderStatus===101){
						//用户查已被接的单
						item={
							orderWaitPhoer:true,
							...item
						}
						this.url='/pages/order/verifyOrder?orderWaitPhoerMsg='+ encodeURIComponent(JSON.stringify(item))
					}
					
				}else if(this.phoerChoiceOrder.phoerId || this.phoerId){
					//摄影师查看所有单 或 摄影师查看我接的单
					if(item.orderStatus===0||item.orderStatus==2||item.orderStatus==3){
						this.phoerChoiceOrder={
							...item,
							phoerId:this.$store.state.user.info._id,//...item一定要在上面，不然item里的空phoerId会覆盖此phoerId
						}  //获取item.userId数据并打包到phoerChoiceOrder发送到order页 3/3 
						this.url='/pages/order/order?phoerChoiceOrder='+ encodeURIComponent(JSON.stringify(this.phoerChoiceOrder)) 
					}else if(item.orderStatus===1||item.orderStatus===101){
						item={
							phoerWaitOrder:true,
							...item
						}
						this.url='/pages/order/verifyOrder?phoerWaitOrderMsg='+ encodeURIComponent(JSON.stringify(item))
					}
					
				}
				uni.navigateTo({
					url:this.url
				})
			},
			getOrderListByOrderId(orderId){
				odb.where({
					userId:orderId
				}).get().then(res=>{
					if(res.result.data.length>0){
						for(var i of res.result.data){
							this.orderList.push(i)
						}
					}
					if(this.orderList.length==0){
						this.empty=true
					}
				})
			},
			getOrderListByPhoerId(phoerId){
				odb.where({
					phoerId:phoerId
				}).get().then(res=>{
					console.log('odb get by phoerId success');
					console.log(res);
					if(res.result.data.length>0){
						for(var i of res.result.data){
							this.orderList.push(i)
						}
					}
					if(this.orderList.length==0){
						this.empty=true
					}
				})
			},
			getAllOrder(){
				odb.where({
					orderStatus:0
				}).get().then(res=>{
					if(res.result.data.length>0){
						for(var i of res.result.data){
							this.orderList.push(i)
						}
					}
					if(this.orderList.length==0){
						this.empty=true
					}
				})
			},
			WPgetOrder(){
				odb.get().then(res=>{
					console.log('odb get by orderId success');
					console.log(res);
					if(res.result.data.length>0){
						for(var i of res.result.data){
							this.orderList.push(i)
						}
					}
					if(this.orderList.length==0){
						this.empty=true
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	.u-page {
		padding: 0;
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
