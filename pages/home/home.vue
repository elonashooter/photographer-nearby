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
		
<!-- 		<view class="ad-1">
			<image src="/static/temp/ad2.jpg" mode="scaleToFill"></image>
		</view> -->
		
		<view class="ltsAnd2hand" @click="AFunctionWillBeDeleteSoon()">
			<view class="ltsItem">
				<text>匿名聊天室</text>
			</view>
			<view class="ltsItem">
				<text>校内二手</text>
			</view>
		</view>

		<!-- 摄影师操作部分 -->
		<view class="phoerCard" v-if="phoerId">
			<u--text
				text='以下为摄影师操作项'
				type='primary'
			></u--text>
			<view class="f-header m-t">
				<u-switch v-model="OnlineStatus" @change="OnlineStatusChange" ></u-switch>
				<view class="tit-box">
					<text class="tit" v-if="!OnlineStatus">点击上线</text>
					<text class="tit" v-else>已处于上线状态</text>
					<text class="tit2">上线后其他同学就可以搜到你并找你下单</text>
				</view>
			</view>
			<u-button
				type="primary"
				text="查看用户已发布的预约列表"
				customStyle="margin-top: 50px;width:400upx"
				@click="getAllOrder()"
			></u-button>
			<u-button
				type="primary"
				text="查看我接的单"
				customStyle="margin-top: 50px;width:400upx"
				color="linear-gradient(to right, rgb(255, 170, 0), rgb(4, 151, 99))"
				@click="getPhoerReceiveList()"
			></u-button>
		</view>
		
		
		
		
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
				orderId:'',
				phoerId:'',
				carouselList:[{
						src: "/static/temp/yl.png",
						background: "rgb(109, 120, 78)",
					},
					{
						src: "/static/temp/phoer-female.png",
						background: "rgb(242, 166, 90)",
					},
					{
						src: "/static/temp/cyx.png",
						background: "rgb(143, 145, 162)",
					}],
				titleNViewBackground: '',
				swiperCurrent: 0,
				swiperLength: 0,
				goodsList: [],
				loadTime:'', //避免被恶意频繁刷访问造成服务器负担  1/4
				character:'',
				WP_manager:false,
				haveNoNet:false
			};
		},
		onLoad() {
			//检测网络状态
			// this.haveNoNet=true
			uni.setTabBarItem({
				index:1,
				visible:false
			})
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
			AFunctionWillBeDeleteSoon(){
				uni.$u.toast("未开放")
			},
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
				uniCloud.database().collection('photographer').where({userId:this.phoerId}).update({
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
					console.log(userInfo);
					if(userInfo.role.includes("WP_manager")){
						this.$store.commit('user/WP_manager',true)
						this.WP_manager=true
						uni.setTabBarItem({
							index:1,
							visible:true
						})
					}
					if(userInfo.role.includes("photographer")){
						this.$store.commit('user/character','phoer')
						this.phoerId=userInfo._id
						// console.log('now character is :'+this.$store.state.user.character);
						this.character='phoer'
					}else{
						this.character='order'
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
		margin-top: 40upx;
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
			line-height: 1.7;
		}
		.tit2{
			font-size: $font-sm;
			color: $font-color-light;
		}
		.icon-you{
			font-size: 28upx;
			color: $font-color-light;
		}
	}

	.phoerCard{
		background-color:antiquewhite;
		border-style: groove;
		border-color: azure;
		margin: 20upx 50upx;
		padding: 20upx;
	}
	.ltsAnd2hand{
		display: flex;margin-top: 60upx;
		height: 500upx;
		background:url('@/static/bg.png') no-repeat center;
		background-size:cover;
		.ltsItem{
			border-radius: 20upx;
			background-color:antiquewhite;
			color:rgba(138, 109, 108, 1.0);
			height:100upx;flex: 1;margin: 20upx;
			border-color:white;
			border-style: solid;text-align: center;
		}
	}
	
</style>
