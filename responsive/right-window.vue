<template>
	<view class="webPage">
		<!-- <newDetail ref="detailPage"></newDetail> -->
		<img class="img" src="../static/11NoBgNoCut.png" alt="图片丢失那这app应该是寄了">
		<view class="OrderCard">
			<view class="OrderCardItem" v-for="(item,index) in cardItem" :key="index">
				<img src="../unpackage/res/icons/192x192.png" class="OCImg">
				<text :style="'color:'+item.textColor+';font-size:30px'" >{{item.text}}</text>
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
				title: 'Hello',
				cardItem:[{
					imgUrl:"../unpackage/res/icons/192x192.png",
					text:"个人照",
					textColor:"rgb(170, 170, 255)",
				},{
					imgUrl:"../unpackage/res/icons/192x192.png",
					text:"宿舍照",
					textColor:"rgb(255, 85, 0)",
				},{
					imgUrl:"../unpackage/res/icons/192x192.png",
					text:"情侣照",
					textColor:"rgb(0, 255, 255)",
				},{
					imgUrl:"../unpackage/res/icons/192x192.png",
					text:"毕业照",
					textColor:"rgb(85, 85, 0)",
				},]
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

<style>
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
		-webkit-filter: blur(3px);
		filter: blur(15px);
	}
	.OrderCard{
		display: grid;
		grid-template-columns: auto auto;
		grid-gap: 5vh;
	}
	.OrderCardItem{
		
	}
	.OCImg{
		height: 15;
		border-radius: 15rpx;
	}
</style>
