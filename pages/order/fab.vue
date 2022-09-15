<template>
	<view @click="close" class="mask">
		<u-text
			type="success"
			:text="bothMsg.payload.fabShowText"
		></u-text>
		<u-text
			v-if="bothMsg.payload.rejectReason"
			type="warning"
			:text="'拒绝理由为:'+bothMsg.payload.rejectReason"
		></u-text>
		<button v-else @click="goToVOrder()"> 立即前往 </button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bothMsg:{},
			}
		},
		onLoad(e) {
			this.bothMsg=JSON.parse(decodeURIComponent(e.bothMsg))//重点是透传
			
		},
		methods: {
			close() {
				uni.navigateBack()
			},
			goToVOrder(){
				uni.navigateTo({
					url:this.bothMsg.payload.url
				})
			}
		}
	}
</script>

<style>
	page {
			background: transparent;
		}

	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>
