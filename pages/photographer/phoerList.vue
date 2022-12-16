<template>
	<view class="u-page">
		<u-empty
			v-if="empty"
			text="暂无在线摄影师"
		></u-empty>
		<u-list>
			<u-list-item
				v-for="(item, index) in phoerList"
				:key="index"
			>
				<u-cell
					:value="item.intro.length<11?item.intro:item.intro.substring(0,10)+'...'"
					center
					isLink
					@click="getItemAndGo(item)" 
					customStyle="position:relative"
					v-if="item.isWPPhoer"
				>
					<u-avatar
						slot="icon"
						shape="square"
						size="70"
						:src="item.phoerShow[0]"
						customStyle="margin: -3px 5px -3px 0"
						mode="aspectFill"
					></u-avatar>
					<view slot="title" class="wpphoerCell">
						<text v-if="item.isWPPhoer" class="wpphoer">平台摄影师</text>
						<text>{{item.name}}</text>
						<text style="margin-top: 16rpx; font-size: 24rpx;color: darkgrey">{{item.phoneNumber}}</text>
					</view>
				</u-cell>
				<u-cell
					:value="item.intro.length<11?item.intro:item.intro.substring(0,10)+'...'"
					:label="item.phoneNumber"
					:title="item.name"
					center
					isLink
					@click="getItemAndGo(item)" 
					v-else
				>
					<u-avatar
						slot="icon"
						shape="square"
						size="70"
						:src="item.phoerShow[0]"
						customStyle="margin: -3px 5px -3px 0"
						mode="aspectFill"
					></u-avatar>
				</u-cell>
			</u-list-item>
			
		</u-list>
	</view>
</template>

<script>
	import AES from '@/js_sdk/ar-aes/ar-aes.js'
	export default {
		data() {
			return {
				orderChoicePhoer:{},
				phoerList: [],
				empty:false,
			}
		},
		onShow() {
			this.getPhoerList()
		},
		onLoad(e) {
			if(e.orderId){
				this.orderChoicePhoer.orderId=e.orderId
			}
		},
		methods: {
			getItemAndGo(phoerInfo){
				if(this.orderChoicePhoer.orderId){
					this.orderChoicePhoer={
						orderId:this.orderChoicePhoer.orderId,
						...phoerInfo
					}  //获取item.userId数据并打包到orderChoicePhoer发送到phoer页 3/3 
					uni.navigateTo({
						url:'/pages/photographer/phoer?orderChoicePhoer='+encodeURIComponent(JSON.stringify(this.orderChoicePhoer))
					})
				}
			},
			getPhoerList(){
				this.phoerList=[]
				// #ifdef APP-PLUS
				let version=plus.runtime.version
				// #endif
				// #ifdef H5 || MP
				let version='H5OrMP'
				// #endif
				//真机调试暂用  
				// let version='H5OrMP'
				uniCloud.database().action('filterLowVersion').collection('photographer').where({
					OnlineStatus:true,
					version:version
				}).get().then((res)=>{
					res.result.data=AES.AES.decrypt(res.result.data,'1234567891234567','1234567891234567')
					res.result.data=JSON.parse(decodeURIComponent(res.result.data))
					if(res.result.data.length>0){
						for(var i of res.result.data){
							this.phoerList.push(i)
						}
					}
					if(this.phoerList.length==0){
						this.empty=true
					}
				}).catch(e=>{
					console.log('phoerlist catch');
					console.log(e);
				})
			}
		},
	}
</script>

<style lang="scss">
	.u-page {
		padding: 0;
	}
	.wpphoer{
		color: white;
		background-color: seagreen;
		border-radius: 8rpx;
		padding: 8rpx;
		width: 16vw;
		font-size:18rpx;
	}
	.wpphoerCell{
		display: flex;
		flex-direction: column;
		font-size:28rpx;
		position: absolute;
		top: 0;
	}
	.normal{
		display: flex;
		flex-direction: row;
		font-size:28rpx;
	}
</style>
