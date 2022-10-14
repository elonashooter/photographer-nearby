<template>
	<view>
		<view class="" v-for="(item,index) in data">
			<text>{{item.user_id}}说</text>
			<text>{{item.content}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:''
			};
		},
		onLoad() {
			uniCloud.database().collection('opendb-feedback').get().then(res=>{
				this.data=res.result.data
				console.log(this.data);
			})
		}

	}
</script>

<style lang="scss">


</style>
