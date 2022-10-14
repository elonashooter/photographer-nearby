<template>
	<view class="webPage">
		<!-- <newDetail ref="detailPage"></newDetail> -->
		<img class="img" src="../static/11NoBgNoCut.png" alt="图片丢失那这app应该是寄了">
		<image src="../static/temp/11layWebTip.png" mode="aspectFit" class="webTip"></image>
		<text style="margin: 5vh;font-size: 20px;color: #ff5500;" >qq群 273467930</text>
		<br>
		<text style="margin: 5vh;font-size: 20px;color: #005500;" >联系电话 18277709303 </text>
		<view class="OrderCard">
			<view class="OrderCardItem">
				<image src="../static/temp/vol-after.png" mode="heightFix"></image>
			</view>
			<view class="OrderCardItem">
				<image src="../static/temp/greenWall.png" mode="heightFix"></image>
			</view>
		</view>
<!-- 		<view class="" style="position: absolute;bottom: 0px; height: 10vh;width: 100vh; border-style: groove;border-width: 7px;margin: 3vh;">
			小屏幕滚动填充
		</view> -->
	</view>
</template>

<script>

	export default {
		components:{
			// newDetail
		},
		data() {
			return {
				title: 'Hello'
			}
		},
		created(e) {
			//监听自定义事件，该事件由详情页列表的点击触发
			uni.$on('updatePage', (e) => {
				// 执行 /pages/news/detail.nvue页面的load方法
				// this.$refs.detailPage.load(e.detail);
				
				console.log("updatePage success");
			})
		}
	}
</script>

<style lang="scss">
	.webPage{
		position: relative;
		padding: 5% 5% 5% 5%;
		height: 100vh;
		min-height: 100vh;
		/* 弹性填充屏幕：100vh即为当前屏幕100%的高度 */
		overflow: visible;
		/* background: url('@/static/11BgNoCut.png') center no-repeat; */

	}
	.img{
		position: absolute;
		z-index: -1;
		//模糊效果
		-webkit-filter: blur(3px);
		filter: blur(15px);
	}
	.OrderCard{
		background-color: rgba(255, 250, 232, 0.3);
		margin-top: 15vh;
		// display: flex;
		// justify-items: flex-start;
		display: grid;
		grid-template-columns: auto auto;
		// border-style: inset;
		// border-width: 20px;
	}
	.OrderCardItem{
		// background-color: red;
		position: relative;
		right:5vw;
		image{
			height: 55vh;
		}
	}
	.webTip{
		position: absolute;
		right:0;
		top: 0;
		width: 40vw;
	}
</style>
