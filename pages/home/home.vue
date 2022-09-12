<template>
	<view v-if="haveNoNet==true">
		<u-empty
			text="未检测到网络连接\n请连接网络后重新打开应用"
			textSize="20"
			customStyle="padding-top:200px"
		></u-empty>
	</view>
	<view class="container" v-else>
		<!-- 小程序头部兼容 -->
		<!-- #ifdef MP -->
		<view class="mp-search-box">
			<input class="ser-input" type="text" value="输入关键字搜索" disabled />
		</view>
		<!-- #endif -->
		
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" indicator-color="rgba(255, 170, 127, 0.3)" indicator-active-color="rgba(85, 255, 127, 0.3)" autoplay="true" interval="5000" indicator-dots="true" circular  duration="200" @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="">
					<image :src="item.src" mode="aspectFill"/>
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			
		</view>
		<!-- 分类 -->
		<view class="cate-section">
<!-- 			<view class="cate-item">
				<image src="/static/temp/c3.png"></image>
				<text>环球美食</text>
			</view> -->
<!-- 			<view class="cate-item">
				<image src="/static/temp/c5.png"></image>
				<text>个护美妆</text>
			</view> -->
			<view class="cate-item">
				<image src="/static/temp/c6.png" @tap="toOrder()"></image>
				<text>发布预约</text>
			</view>
			<!-- 摄影师同时也是用户 -->
			<view class="cate-item" v-if="character=='phoer'">
				<image src="/static/temp/c7.png" @tap="toPhoer(phoerId)"></image>
				<text>编辑自己</text>
			</view>
			<!-- 用户有三种状态：游客 普通 摄影师 -->
			<view class="cate-item" v-else-if="character=='order'">
				<image src="/static/temp/c7.png" @tap="toBePhoer()"></image>
				<text>加入湾拍 </text>
			</view>
			<view class="cate-item">
				<image src="/static/temp/c1.png" @tap="getPhoer()"></image>
				<text>在线摄影师 </text>
			</view>
			<view class="cate-item">
				<image src="/static/temp/c8.png" @tap="toMyOrderList()"></image>
				<text>我的预约</text>
			</view>
			
		</view>
		
		<view class="ad-1">
			<image src="/static/temp/ad2.jpg" mode="scaleToFill"></image>
		</view>
		
		<!-- 摄影师部分 -->

		<view class="f-header m-t">
			<image src="/static/temp/h1.png" ></image>
			<view class="tit-box">
				<text class="tit">在线摄影师</text>
				<text class="tit2">非摄影师用户可通过此查看在线的摄影师</text>
			</view>
			<text class="yticon icon-you"></text>
		</view>
		
		<u-line></u-line>
		
		<u--text
			v-if="phoerId"
			text='以下为摄影师操作项'
			type='primary'
			style='margin:5% 34%;'
		></u--text>
		<view class="f-header m-t" v-if="phoerId">
			<u-switch v-model="OnlineStatus" @change="OnlineStatusChange" ></u-switch>
			<view class="tit-box">
				<text class="tit" v-if="!OnlineStatus">点击上线</text>
				<text class="tit" v-else>已处于上线状态</text>
				<text class="tit2">上线后其他同学就可以搜到你并找你下单</text>
			</view>
			<text class="yticon icon-you"></text>
		</view>
		<u-button
			type="primary"
			text="查看用户已发布的预约列表"
			customStyle="margin-top: 50px;width:400rpx"
			@click="getAllOrder()"
			v-if="phoerId"
		></u-button>
		<u-button
			type="primary"
			text="查看我接的单"
			customStyle="margin-top: 50px;width:400rpx"
			color="linear-gradient(to right, rgb(255, 170, 0), rgb(4, 151, 99))"
			@click="getPhoerReceiveList()"
			v-if="phoerId"
		></u-button>
		<!-- 加载组件  onshow触发一秒，用于防止恶意高频率访问 -->
<!-- 		<u-loading-page
		    loadingText="感谢支持(*•̀ㅂ•́)و"
		    bgColor="#ffffff"
		    :loading="loading"
		    color="#C8C8C8"
		    loadingColor="#C8C8C8"
		>
		</u-loading-page> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading:true,//加载组件的加载状态
				OnlineStatus:false, //摄影师上线状态
				orderId:this.$store.state.user.info._id,
				phoerId:'',
				carouselList:[{
						src: "/static/temp/phoer-male.jpg",
						background: "rgb(203, 87, 60)",
					},
					{
						src: "/static/temp/phoer-female.jpg",
						background: "rgb(205, 215, 218)",
					},
					{
						src: "/static/temp/lengjingfenxi.jpg",
						background: "rgb(183, 73, 69)",
					}],
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				goodsList: [],
				loadTime:'', //避免被恶意频繁刷访问造成服务器负担  1/4
				character:this.$store.state.user.character,
				WP_manager:this.$store.state.user.WP_manager,
				haveNoNet:false
			};
		},
		onLaunch() {

		},
		onLoad() {
			//检测网络状态
			// this.haveNoNet=true
			uni.getNetworkType({
				success: res=> {
					// debugger
					console.log("net status:"+res.networkType);
					if(res.networkType!=="none"){
						this.loadData();
					}else{
						this.haveNoNet=true
					}
				}
			});
			//测试全局弹窗组件
			// uni.navigateTo({
			// 	url:"/pages/order/fab"
			// })
		},
		onShow() {
			
			//避免被恶意频繁刷访问造成服务器负担  2/4
			// this.loadTime=setTimeout(()=>{
			// 	this.showLoading(),
				this.checkPhoer()
			// },3000)

			
		},
		onHide() {
			//避免被恶意频繁刷访问造成服务器负担  3/4
			clearTimeout(this.loadTime)
		},
		// mounted() {
		// 	this.loadData()
		// },
		methods: {
			//发布预约
			toOrder(){
				uni.navigateTo({
					url: '/pages/order/order'
				});
			},
			//我的预约
			toMyOrderList(){
				uni.navigateTo({
					url: '/pages/order/orderList?orderId='+this.orderId
				});
			},
			//摄影师查看所有用户已发布的预约列表
			getAllOrder(){
				uni.navigateTo({
					url: '/pages/order/orderList?phoerChoiceOrder=1'
				});
				// this.odb.get().then(res=>{
				// 	console.log("getOrder");
				// 	console.log(res);
				// })
			},
			//摄影师查看自己接的单
			getPhoerReceiveList(){
				uni.navigateTo({
					url: '/pages/order/orderList?phoerId='+this.phoerId
				});
				// this.odb.where({
				// 	phoerId:this.phoerId
				// }).get().then(res=>{
				// 	console.log("getOrder");
				// 	console.log(res);
				// })
			},
			//加入湾拍
			toBePhoer(){
				uni.navigateTo({
					url: '/pages/photographer/pre-phoer'
				});
			},
			//编辑自己
			toPhoer(e){
				// console.log(e);
				uni.navigateTo({
					url: '/pages/photographer/pre-phoer?phoerId='+e
				});
			},
			//查询在线摄影师 用户用于预约摄影师
			getPhoer(){
				uni.navigateTo({
					url: '/pages/photographer/phoerList?orderId='+this.orderId
				});
				// this.pdb.where('OnlineStatus == true').get().then(res=>
				// 	console.log(res)
				// )
			},
			// 摄影师点击上线时上传数据  只有摄影师可见
			OnlineStatusChange(){
				this.pdb.where({userId:this.phoerId}).update({
					OnlineStatus:this.OnlineStatus
				}).then(()=>{
					this.$store.commit('user/OnlineStatus',this.OnlineStatus)
					console.log(this.$store.state.user.OnlineStatus);
				})
			},
			
			/**
			 * 请求静态数据只是为了代码不那么乱
			 * 分次请求未作整合
			 */
			loadData() {
				let carouselList = this.carouselList
				this.titleNViewBackground = carouselList[0].background;
				this.swiperLength = carouselList.length;
				this.carouselList = carouselList;
			},
			//避免被恶意频繁刷访问造成服务器负担  4/4
			// showLoading(){
			// 	this.loading = false
			// 	// console.log("showLoading");
			// },
			checkPhoer(){
				// console.log("this.info 用户信息");
				//检测当前用户是摄影师还是普通用户
				if(this.$store.state.user.hasLogin){
					let userInfo=this.$store.state.user.info
					if(userInfo.role.includes("WP_manager")){
						this.$store.commit('user/WP_manager',true)
						this.WP_manager=this.$store.state.user.WP_manager
					}
					if(userInfo.role.includes("photographer")){
						this.$store.commit('user/character','phoer')
						this.phoerId=userInfo._id
						// console.log('now character is :'+this.$store.state.user.character);
						this.character=this.$store.state.user.character//phoer
					}
					this.orderId=userInfo._id
				}
				

			},
			//轮播图切换修改背景色
			swiperChange(e) {
				const index = e.detail.current;
				this.swiperCurrent = index;
				this.titleNViewBackground = this.carouselList[index].background;
			},
			
			
		},
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			uni.showToast({
				title:"点击了搜索框",
				icon:"none"
			})
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				uni.showToast({
					title:"点击了扫描",
					icon:"none"
				})
			} else if (index === 1) {
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.hideTitleNViewButtonRedDot({
					index
				});
				// #endif
				// uni.navigateTo({
				// 	url: ''
				// })
			}
		}
		// #endif
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	.mp-search-box{
		position:absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;
		.ser-input{
			flex:1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color:$font-color-base;
			border-radius: 20px;
			background: rgba(255,255,255,.6);
		}
	}
	page{
		.cate-section{
			position:relative;
			z-index:5;
			border-radius:16upx 16upx 0 0;
			margin-top:-20upx;
		}
		.carousel-section{
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				left:45upx;
				bottom:40upx;
			}
		}
	}
	/* #endif */
	
	
	page {
		background: #f5f5f5;
	}
	.m-t{
		margin-top: 16upx;
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 470upx;
			transition: .4s;
		}
	}
	.carousel {
		display:block;
		margin: 0 auto;
		width: 92%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}
	.swiper-dots {
		display: flex;
		position: absolute;
		left: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}
	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30upx 22upx; 
		background: #fff;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
	.ad-1{
		width: 100%;
		height: 210upx;
		padding: 10upx 0;
		background: #fff;
		image{
			width:100%;
			height: 100%; 
		}
	}
	/* 秒杀专区 */
	.seckill-section{
		padding: 4upx 30upx 24upx;
		background: #fff;
		.s-header{
			display:flex;
			align-items:center;
			height: 92upx;
			line-height: 1;
			.s-img{
				width: 140upx;
				height: 30upx;
			}
			.tip{
				font-size: $font-base;
				color: $font-color-light;
				margin: 0 20upx 0 40upx;
			}
			.timer{
				display:inline-block;
				width: 40upx;
				height: 36upx;
				text-align:center;
				line-height: 36upx;
				margin-right: 14upx;
				font-size: $font-sm+2upx;
				color: #fff;
				border-radius: 2px;
				background: rgba(0,0,0,.8);
			}
			.icon-you{
				font-size: $font-lg;
				color: $font-color-light;
				flex: 1;
				text-align: right;
			}
		}
		.floor-list{
			white-space: nowrap;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item{
			width: 150upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;
			image{
				width: 150upx;
				height: 150upx;
				border-radius: 6upx;
			}
			.price{
				color: $uni-color-primary;
			}
		}
	}
	
	.f-header{
		display:flex;
		align-items:center;
		height: 140upx;
		padding: 6upx 30upx 8upx;
		background: #fff;
		image{
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			margin-right: 20upx;
		}
		.tit-box{
			flex: 1;
			display: flex;
			flex-direction: column;
			margin-left: 20px;
		}
		.tit{
			font-size: $font-lg +2upx;
			color: #font-color-dark;
			line-height: 1.3;
		}
		.tit2{
			font-size: $font-sm;
			color: $font-color-light;
		}
		.icon-you{
			font-size: $font-lg +2upx;
			color: $font-color-light;
		}
	}
	/* 团购楼层 */
	.group-section{
		background: #fff;
		.g-swiper{
			height: 650upx;
			padding-bottom: 30upx;
		}
		.g-swiper-item{
			width: 100%;
			padding: 0 30upx;
			display:flex;
		}
		image{
			width: 100%;
			height: 460upx;
			border-radius: 4px;
		}
		.g-item{
			display:flex;
			flex-direction: column;
			overflow:hidden;
		}
		.left{
			flex: 1.2;
			margin-right: 24upx;
			.t-box{
				padding-top: 20upx;
			}
		}
		.right{
			flex: 0.8;
			flex-direction: column-reverse;
			.t-box{
				padding-bottom: 20upx;
			}
		}
		.t-box{
			height: 160upx;
			font-size: $font-base+2upx;
			color: $font-color-dark;
			line-height: 1.6;
		}
		.price{
			color:$uni-color-primary;
		}
		.m-price{
			font-size: $font-sm+2upx;
			text-decoration: line-through;
			color: $font-color-light;
			margin-left: 8upx;
		}
		.pro-box{
			display:flex;
			align-items:center;
			margin-top: 10upx;
			font-size: $font-sm;
			color: $font-base;
			padding-right: 10upx;
		}
		.progress-box{
			flex: 1;
			border-radius: 10px;
			overflow: hidden;
			margin-right: 8upx;
		}
	}
	/* 分类推荐楼层 */
	.hot-floor{
		width: 100%;
		overflow: hidden;
		margin-bottom: 20upx;
		.floor-img-box{
			width: 100%;
			height:320upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background: linear-gradient(rgba(255,255,255,.06) 30%, #f8f8f8);
			}
		}
		.floor-img{
			width: 100%;
			height: 100%;
		}
		.floor-list{
			white-space: nowrap;
			padding: 20upx;
			padding-right: 50upx;
			border-radius: 6upx;
			margin-top:-140upx;
			margin-left: 30upx;
			background: #fff;
			box-shadow: 1px 1px 5px rgba(0,0,0,.2);
			position: relative;
			z-index: 1;
		}
		.scoll-wrapper{
			display:flex;
			align-items: flex-start;
		}
		.floor-item{
			width: 180upx;
			margin-right: 20upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			line-height: 1.8;
			image{
				width: 180upx;
				height: 180upx;
				border-radius: 6upx;
			}
			.price{
				color: $uni-color-primary;
			}
		}
		.more{
			display:flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			flex-shrink: 0;
			width: 180upx;
			height: 180upx;
			border-radius: 6upx;
			background: #f3f3f3;
			font-size: $font-base;
			color: $font-color-light;
			text:first-child{
				margin-bottom: 4upx;
			}
		}
	}
	/* 猜你喜欢 */
	.guess-section{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.guess-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
	

</style>
