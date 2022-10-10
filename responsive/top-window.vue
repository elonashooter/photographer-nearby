<template>
	<view class="topWindow">
		<!-- <newDetail ref="detailPage"></newDetail> -->
		<view class="leftPart">
			<image src="/static/36x36.png" class="image">
			<image src="/static/grid/c1.png" class="image">
			<image src="/static/grid/c1.png" class="image">
		</view>
		<view class="rightPart">
<!-- 			<text v-if="nickname" class="">{{nickname}}欢迎您</text>
			<text v-else>未登录</text> -->
			<view class="partItem">
				<image src="/static/missing-face.png" class="image">
			</view>

			<!-- <view class="partItem" style="padding-top:10px;padding-left: 30px;font-size: 20px;"> -->
			<view class="partItem">
				<text v-if="username!=''">{{username}}</text>
				<text @click="login()" v-else>登陆</text>
			</view>

		</view>

		

	</view>
</template>

<script>
	// import newDetail from '../pages/news/detail.nvue'
	export default {
		components:{
			// newDetail
		},
		data() {
			return {
				title: 'Hello',
				username:'',
				uAvatar:'' //暂时没法用 连官方的admin都没法把头像放在topWindow 一用uview组件就报错
			}
		},
		created(e) {
			//监听自定义事件，该事件由详情页列表的点击触发
			uni.$on('updateHead', (e) => {
				// 执行 /pages/news/detail.nvue页面的load方法
				console.log('head update');
				console.log(e);
				this.username=e.username
				this.uAvatar=e.uAvatar  //传过来也没法用 连官方的admin都没法把头像放在topWindow 一用uview组件就报错
			})
			
		},
		methods:{
			login(){
				uni.navigateTo({
					url:'/pages/ucenter/login-page/pwd-login/pwd-login'
				})
			}
		}

	}
</script>

<style lang="scss">
	.topWindow{
		background-color: darkorange;
		height: 44px;
	}
	.leftPart{
		display: flex;
		position: absolute;
		left: 20px;
	}
	.rightPart{
		width: 50vw;
		height: 100%;
		display: flex;
		justify-content: center;
		position: absolute;
		right: 0px;
	}
	.partItem{
		padding-left: 30px;
		margin: auto 0;
		font-size: 22px;
	}
	.image{
		margin-top: 3px;
		width: 38px;
		height: 38px;
	}
</style>
