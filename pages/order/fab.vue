<template>
	<view @click="close" class="mask">
		
		<view class="box">
			<u-text
				type="success"
				:text="bothMsg.payload.fabShowText"
				size="40rpx"
			></u-text>
			<u-text
				v-if="bothMsg.payload.rejectReason"
				type="warning"
				:text="'拒绝理由为:'+bothMsg.payload.rejectReason"
			></u-text>
			<u-button
				v-if="bothMsg.payload.url"
				type="primary"
				text="立即前往"
				size="normal"
				@click="goToVOrder()"
				color="linear-gradient(to right, rgb(255, 170, 0), rgb(170, 85, 255))"
				customStyle="margin-top:80rpx"
			></u-button>
			<u-button
				v-else-if='bothMsg.payload.CharacterChange'
				type="primary"
				text="立即重新登陆"
				size="normal"
				@click="reLogin()"
				color="linear-gradient(to right, rgb(255, 170, 0), rgb(170, 85, 255))"
				customStyle="margin-top:80rpx"
			></u-button>
		</view>
		
	</view>
</template>

<script>
	import {mapActions} from 'vuex'
	export default {
		data() {
			return {
				bothMsg:{},
			}
		},
		onLoad(e) {
			console.log('fab get');
			console.log(JSON.parse(decodeURIComponent(e.bothMsg)));
			this.bothMsg=JSON.parse(decodeURIComponent(e.bothMsg))//重点是透传
			
		},
		methods: {
			...mapActions({
				logout: 'user/logout'
			}),
			close() {
				uni.navigateBack()
			},
			goToVOrder(){
				console.log(this.bothMsg.payload.url+encodeURIComponent(JSON.stringify(this.bothMsg.payload.msg)));
				uni.reLaunch({
					url:this.bothMsg.payload.url+encodeURIComponent(JSON.stringify(this.bothMsg.payload.msg))
				})
			},
			reLogin(){
				this.logout()
				uni.reLaunch({
					url:'/pages/ucenter/login-page/pwd-login/pwd-login'
				})
			}
			
		}
	}
</script>

<style lang="scss">
	page {
		/* #ifdef APP-PLUS */
		background: transparent;
		/* #endif */
			
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
	.box{
		padding: 30rpx;
		height: 300upx;
		overflow: auto;
		width: 61%;
		background-color: aliceblue;
		display: flex-row;
		border-radius: 30rpx;
	}
</style>
