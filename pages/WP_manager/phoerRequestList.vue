<template>
	<view class="u-page">
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
					:url="'/pages/WP_manager/phoer-request?phoerId='+item.userId"
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
				
			}
		},
		onLoad(e) {
			this.getPrePhoerList()
		},
		methods: {
			scrolltolower() {
				// this.loadmore()
			},

			getPrePhoerList(){
				this.ppdb.where({
					AuditStatus:false
				}).get().then(res=>{
					this.prePhoerList=res.result.data
					console.log("getPrePhoerList");
					console.log(this.prePhoerList);
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
