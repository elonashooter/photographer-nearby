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
					:title="item.name"
					:value="item.intro"
					:label="item.phoneNumber"
					center
					isLink
					@click="getItemAndGo(item)" 
				>
					<u-avatar
						slot="icon"
						shape="square"
						size="70"
						:src="item.phoerShowUrl"
						customStyle="margin: -3px 5px -3px 0"
						mode="aspectFill"
					></u-avatar>
				</u-cell>
			</u-list-item>
			
		</u-list>
	</view>
</template>

<script>
	let pdb=uniCloud.database().collection('photographer')
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
			scrolltolower() {
				// this.loadmore()
			},
			getItemAndGo(phoerInfo){
				if(this.orderChoicePhoer.orderId){
					this.orderChoicePhoer={
						orderId:this.orderChoicePhoer.orderId,
						...phoerInfo
					}  //获取item.userId数据并打包到phoerChoiceOrder发送到order页 3/3 
					uni.navigateTo({
						url:'/pages/photographer/phoer?orderChoicePhoer='+encodeURIComponent(JSON.stringify(this.orderChoicePhoer))
					})
				}
			},
			getPhoerList(){
				this.phoerList=[]
				pdb.get().then(res=>{
					console.log('pdb get success');
					console.log(res);
					if(res.result.data.length>0){
						for(var i of res.result.data){
							if (i.OnlineStatus==true){
								this.phoerList.push(i)
							}
						}
					}
					if(this.phoerList.length==0){
						this.empty=true
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	.u-page {
		padding: 0;
	}
</style>
