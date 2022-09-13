<template>
	<view class="u-page">
		<u-empty
			v-if="pendingData[0]==null&&tabbarValue==0"
			text="暂无待处理请求"
		></u-empty>
		<u-empty
			v-if="solvedData[0]==null&&tabbarValue==1"
			text="暂无已处理数据"
		></u-empty>
		<u-list>
			<u-list-item
				v-if="tabbarValue==0"
				v-for="(item, index) in pendingData"
				:key="index"
			>
				<u-cell
					:title="item.name"
					:value="item.intro"
					:label="item.phoneNumber"
					center
					isLink
					:url="'/pages/WP_manager/phoer-request?_id='+item._id"
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
			
			<u-list-item
				v-if="tabbarValue==1"
				v-for="(item, index) in solvedData"
				:key="index"
			>
				<u-cell
					:title="item.name"
					:value="item.intro"
					:label="item.phoneNumber"
					center
					isLink
					:url="'/pages/WP_manager/phoer-request?_id='+item._id"
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
		<u-tabbar
		    :value="tabbarValue"
		    @change="name=>tabbarValue=name"
		    :fixed="true"
			:placeholder="true"
		    :safeAreaInsetBottom="true"
		>
			<u-tabbar-item
			    text="待处理"
			    icon="pushpin"
			>
			</u-tabbar-item>
			<u-tabbar-item
			    text="已处理"
			    icon="checkmark"
			></u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	let ppdb=uniCloud.database().collection('pre-photographer')

	export default {
		data() {
			return {
				prePhoerList: [],
				empty:false,
				tabbarValue:0,
				pendingData:[],//待处理
				solvedData:[]//已处理
			}
		},
		onShow() {
			this.getPrePhoerList()
		},
		methods: {
			scrolltolower() {
				// this.loadmore()
			},

			getPrePhoerList(){
				this.pendingData=[]
				this.solvedData=[]
				ppdb.get().then(res=>{
					if(res.result.data.length>0){
						for(var i of res.result.data){
							if (i.AuditStatus==0){
								this.pendingData.push(i)
							}else{
								this.solvedData.push(i)
							}
						}
					}else{
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
