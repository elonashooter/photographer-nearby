<template>
	<view class="u-page" v-if="empty">
		<u-empty></u-empty>
	</view>
	<view class="u-page" v-else>
		<u-list>
			<u-list-item
				v-for="(item, index) in prePhoerList"
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				prePhoerList: [],
				empty:false
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
				this.ppdb.where({
					AuditStatus:0
				}).get().then(res=>{
					if(res.result.data.length>0){
						this.prePhoerList=res.result.data
						console.log("getPrePhoerList");
						console.log(this.prePhoerList);
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
