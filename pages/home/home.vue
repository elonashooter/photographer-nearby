<template>
	<view v-if="haveNoNet==true">
		<u-empty
			text="未检测到网络连接\n请连接网络后重新打开应用"
			textSize="20"
			customStyle="padding-top:200px"
		></u-empty>
	</view>
	<view class="container" :style="containerStyle" v-else id="guide-container">
		<!-- 小程序头部兼容 -->
		<!-- #ifde MP -->
<!-- 		<view class="mp-search-box">
			<input class="ser-input" type="text" value="输入关键字搜索" disabled />
		</view> -->
		<!-- #endi -->
		<!-- 引导插件 1/4 -->
		<cms-easy-guide ref="easyGuide" />
		
		<!-- 头部轮播 -->
		<view class="carousel-section" id="guide_0">
			<!-- 标题栏和状态栏占位符 -->
			<view class="titleNview-placing"></view>
			<!-- 背景色区域 -->
			<view class="titleNview-background" :style="{backgroundColor:titleNViewBackground}"></view>
			<swiper class="carousel" indicator-color="rgba(255, 170, 127, 0.3)" indicator-active-color="rgba(85, 255, 127, 0.3)" autoplay="true" interval="5000" indicator-dots="true" circular  duration="200" @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="">
					<image :src="item.src" mode="aspectFill" @click="getSwiperPhoer(item.phoerId)" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			
		</view>
		<!-- 分类 -->
		<view class="cate-section" >
<!-- 			<view class="cate-item">
				<image src="/static/temp/c3.png"></image>
				<text>环球美食</text>
			</view> -->
<!-- 			<view class="cate-item">
				<image src="/static/temp/c5.png"></image>
				<text>个护美妆</text>
			</view> -->
			<view class="cate-item">
				<image src="/static/temp/fbyy.png" @tap="toOrder()"></image>
				<text>发布预约</text>
			</view>
			<!-- 摄影师同时也是用户 -->
		
			
			<view class="cate-item">
				<image src="/static/temp/zxsys.png" @tap="getPhoer()"></image>
				<text>在线摄影师 </text>
			</view>
			<view class="cate-item">
				<image src="/static/temp/wdyy.png" @tap="toMyOrderList()"></image>
				<text>我的预约</text>
			</view>
		
		</view>
		
<!-- 		<view class="ad-1">
			<image src="/static/temp/ad2.jpg" mode="scaleToFill"></image>
		</view> -->
		
		
		
		<view class="ltsAnd2hand">
			<image :src="imgSrc" mode="aspectFill"   @click="changeCid()"></image>
			<view class="ltsItem">
				<text>爱国 敬业</text>
			</view>
			<view class="ltsItem">
				<text>诚信 友善</text>
			</view>
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
	let inQinZhou=false
	let haveProcess=false
	import AES from '@/js_sdk/ar-aes/ar-aes.js'
	import{mapGetters} from 'vuex'
	export default {
		data() {
			return {
				// loading:true,//加载组件的加载状态
				OnlineStatus:false, //摄影师上线状态
				_isWidescreen:false,
				containerStyle:'',
				orderId:'',
				phoerId:'',
				imgSrc:'../../static/bg.png',
				carouselList:[{
						src: "/static/temp/green.jpg",
						// src: "/static/temp/11layWebTip.png",
						background: "rgb(109, 120, 78)",
						phoerId:'629779368c195b0001e2f55c',
					},
					{
						src: "/static/temp/fromLYY4.jpg",
						background: "rgb(196, 222, 246)",
						phoerId:'629779368c195b0001e2f55c',
					},
					{
						src: "/static/temp/fromLYY3.jpg",
						// src: "/static/temp/11layWebTip.png",
						background: "rgb(115, 153, 181)",
						phoerId:'629779368c195b0001e2f55c',
					}],
				titleNViewBackground: "rgb(109, 120, 78)",
				// loadTime:'', //避免被恶意频繁刷访问造成服务器负担  1/4
				// WP_manager:false,
				haveNoNet:false
			};
		},
		created() {
		  // 动态宽屏检测与宽屏适配
		  // #ifdef H5
		  var mediaQueryOb = uni.createMediaQueryObserver(this)
		  mediaQueryOb.observe({
		    minWidth: 768
		  }, matches => {
		    this._isWidescreen = matches;
			this.showTabbarAndSearch()
		  })
		  // #endif
			
		  

		},
		onLoad() {
			// uni.getPushClientId({
			// 	success: (res) => {
			// 		console.log(res.cid);
			// 	}
			// })
			// uni.getStorage({
			// 	key:'chatHistory',
			// 	success: (res) => {
			// 		console.log(res.data);
			// 	}
			// })
			// uni.removeStorage({
			// 	key:'chatHistory'
			// })
			// uni.clearStorage()
			//检测网络状态
			// this.haveNoNet=true
			// uni.getNetworkType({
			// 	success: res=> {
			// 		// debugger
			// 		console.log("net status:"+res.networkType);
			// 		if(res.networkType=="none"){
			// 			this.haveNoNet=true
			// 		}
			// 	},
			// 	fail: (res) => {
			// 		uni.showToast({
			// 			title: '手机网络异常',
			// 			icon: 'none'
			// 		});
			// 	}
			// });
			//测试全局弹窗组件
			// uni.navigateTo({
			// 	url:"/pages/order/fab"
			// })
		},
		onShow() {
			this.checkPhoer()
			// uni.getStorageInfo({
			// 	success: (res) => {
			// 		console.log(res);
			// 	}
			// })
			//避免被恶意频繁刷访问造成服务器负担  2/4
			// this.loadTime=setTimeout(()=>{
			// 	this.showLoading(),
				// this.checkPhoer()
			// },3000)
			// 静态宽屏检测  与动态二选一即可
			// uni.getSystemInfo({
			// 	success(res) {
			// 		console.log("windowW");
			// 		console.log(res.windowWidth);
			// 		if(res.windowWidth>768){
			// 			console.log("WTF?????");
			// 			this._isWidescreen=true
			// 			uni.hideTabBar()
			// 		}else{
			// 			this._isWidescreen=false
			// 			uni.showTabBar()
			// 		}
			// 	}
			// })
			
		},
		onHide() {
			//避免被恶意频繁刷访问造成服务器负担  3/4
			// clearTimeout(this.loadTime)
		},
		onReady() {
			//公共模块加密返回数据测试
			// uniCloud.callFunction({
			// 	name:'AESRequest',
			// 	data:{},
			// 	success: (res) => {
			// 		console.log("aes get");
			// 		console.log(res);
			// 	},
			// 	fail(e) {
			// 		console.log('aes get fail');
			// 		console.log(e);
			// 	}
			// })
			// #ifdef H5
			
			if(this._isWidescreen&&this.$store.state.user.hasLogin){
				uni.$emit('updateHead',{username:this.$store.state.user.info.username,
										uAvatar:this.$store.state.user.info.avatar_file.url+this.$store.state.user.info.avatar_file.extname})
				uni.$emit('updateRightPage',{hasLogin:true})
			}
			// #endif
			
			uni.getStorage({
				key:"inQinZhou",
				success: (res) => {
					inQinZhou=res.data
				}
			})
			//引导 2/4
			uni.getStorage({
				key:"haveProcess",
				success: (res) => {
					haveProcess=res.data
				},
				complete: () => {
					this.startProcess()
				}
			})
			// #ifdef APP-PLUS
			uni.getStorage({
				key:"GPSColor",
				success: (res) => {
					//没set过就是红色  set过就是白色
					let pages = getCurrentPages();
					let page = pages[pages.length - 1];
					let currentWebview = page.$getAppWebview();
					currentWebview.setTitleNViewButtonStyle(0,{color:res.data});
				}
			})

			// #endif
			
		},
		// mounted() {
		// 	this.loadData()
		// },
		methods: {
			//发布预约
			changeCid(){
				if(this.$store.state.user.hasLogin&&this.$store.state.user.character=='phoer')
					uni.getPushClientId({
						success: (res) => {
							console.log(res.cid);
							uniCloud.database().collection('photographer').where({userId:this.$store.state.user.info._id}).update({
								push_clientid:res.cid
							}).then(e=>{
								uni.$u.toast('摄影师识别码认证成功')
								this.imgSrc='../../static/11NoBgCut.png'
							})
							uniCloud.database().collection('chatMatch').where({phoerId:this.$store.state.user.info._id}).update({
								phoerPushId:res.cid
							}).then(e=>{
								console.log('云聊天库重匹配完毕');
							}).catch(e=>{
								console.log('云聊天库重匹配完毕失败');
							})
						},
						fail: (res) => {
							uni.$u.toast('获取失败，请联系管理员')
						}
					})
			},
			//宽屏适配
			// #ifdef H5
			showTabbarAndSearch(){
				if(this._isWidescreen){
					this.containerStyle="overflow:scroll"
					uni.hideTabBar()
				}else{
					this.containerStyle=""
					uni.showTabBar()
				}
			},
			// #endif
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

			getSwiperPhoer(phoerId){
				uni.navigateTo({
					url: '/pages/photographer/phoer?phoerId='+phoerId
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


			//避免被恶意频繁刷访问造成服务器负担  4/4
			// showLoading(){
			// 	this.loading = false
			// 	// console.log("showLoading");
			// },
			checkPhoer(){
				console.log("checkphoer");
				//检测当前用户是摄影师还是普通用户
				if(this.$store.state.user.hasLogin){
					let userInfo=this.$store.state.user.info
					if(userInfo.role){
						if(userInfo.role.includes("WP_manager")){
							this.$store.commit('user/WP_manager',true)
							// this.WP_manager=true
						}else{
							this.$store.commit('user/WP_manager',false)//切换账号时调回来
						}
						if(userInfo.role.includes("photographer")){
							this.setPhoer()
						}else{
							this.setOrder()
						}
					}else{
						this.setOrder()
					}
				}else{
					this.orderId='';
					this.phoerId='';
					this.$store.commit('user/WP_manager',false)
					this.$store.commit('user/character','')
				}
				

			},
			setPhoer(){
				this.$store.commit('user/character','phoer')
				this.phoerId=this.$store.state.user.info._id
				this.orderId=this.$store.state.user.info._id
			},
			setOrder(){
				this.$store.commit('user/character','order')
				this.orderId=this.$store.state.user.info._id
				this.phoerId=''
			},
			//轮播图切换修改背景色
			swiperChange(e) {
				this.titleNViewBackground = this.carouselList[e.detail.current].background;
			},
			// 引导 3/4
			startProcess() {
				if(haveProcess){
					return;
				}else{
					uni.setStorage({
						key:"haveProcess",
						data:true
					})
				}
				this.$refs.easyGuide.startGuide([
					// 引导元素1
					{
						// that: this, // 必填that为当前this
						queryClass: '.guide1', // 针对那块元素进行引导
						// canMaskJump: true, // 是否可以通过点击mask遮罩下一步
						imgs: [{ // imgs 引导图片
							width: '569rpx',				// 图片宽
							height: '183rpx',				// 图片高
							left: '20rpx',					// 以引导元素左上角定位
							top: '100rpx',					// 以引导元素左上角定位
							src: '/static/process.png',		// 图片连接
							clickEvent:()=>{				// 点击事件
								console.log('clickEvent')
							}
						}, {
							width: '223rpx',				// 图片宽
							height: '116rpx',				// 图片高
							left: '200rpx',					// 以引导元素左上角定位
							top: '230rpx',					// 以引导元素左上角定位
							src: '/static/process-btn.png',	// 图片连接
							isNextButton: true,				// 是否需点击元素进行下一个引导
							clickEvent:()=>{				// 点击事件
								this.getLocation()
							}
						}]
					},
					// 引导元素2
					// {
					// 	// that: this, // 必填that为当前this
					// 	queryClass: '.guide2', // 针对那块元素进行引导
					// 	// canMaskJump: true, // 是否可以通过点击mask遮罩下一步
					// 	imgs: [{ // imgs 引导文本
					// 		width: '569rpx',				// 图片宽
					// 		height: '183rpx',				// 图片高
					// 		left: '-60rpx',					// 以引导元素左上角定位
					// 		top: '-100rpx',					// 以引导元素左上角定位
					// 		src: '/static/select.png',		// 图片连接
					// 		clickEvent:()=>{				// 点击事件
					// 			console.log('clickEvent')
					// 		}
					// 	}, {//"下一步"的按钮图片
					// 		width: '223rpx',				// 图片宽
					// 		height: '116rpx',				// 图片高
					// 		left: '200rpx',					// 以引导元素左上角定位
					// 		top: '200rpx',					// 以引导元素左上角定位
					// 		src: '/static/select.png',	// 图片连接
					// 		isNextButton: true,				// 是否需点击元素进行下一个引导
					// 		clickEvent:()=>{				// 点击事件
					// 			console.log('clickEvent')
					// 		}
					// 	}]
					// },
				])
			},
			getLocation(){
				// console.log(inQinZhou);
				if(inQinZhou){
					uni.showToast({
						title:"已在钦州",
						icon:"success"
					})
					return;
				}
					
				// #ifdef APP-PLUS || MP
				//获取定位  记得上线小程序时写另一套 因为小程序地图免费
				uni.getLocation({
					type:'gcj02',
					geocode:true,
					success: (res) => {
						console.log("adress here");
						console.log(res.address);
						if(res.address.city=='钦州市'){
							uni.showToast({
								title:"确认在钦州",
								icon:"success"
							})
							uni.setStorage({
								key:"inQinZhou",
								data:true
							})
							uni.setStorage({
								key:"GPSColor",
								data:'#ffffff'
							})
							// #ifdef APP-PLUS
							let pages = getCurrentPages();
							let page = pages[pages.length - 1];
							let currentWebview = page.$getAppWebview();
							currentWebview.setTitleNViewButtonStyle(0,{color:'#ffffff'});
							// #endif
						}else{
							uni.showToast({
								title:"不在钦州",
								icon:"error"
							})
						}
						
					},
					fail: (res) => {
						uni.showToast({
							title:"请开启gps重试",
							icon:"error"
						})
					}
				})
				// #endif
			}
			
			
		},
		// 监听是否有新的聊天消息 start 可能需要换成mapState，因为不确定这样能不能动态读取到homeRedDot的变化
		computed:{
			...mapGetters({
				showRedDot:'chat/homeRedDot'
			})
		},
		watch:{
			showRedDot(){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.WebviewTitleNViewStyles.redDot=this.showRedDot
				// #endif
				
				return 
			}
		},
		// 监听是否有新的聊天消息 end
		// #ifndef MP
		// 标题栏input搜索框点击
		onNavigationBarSearchInputClicked: async function(e) {
			// this.getSwiperPhoer()
		},
		//点击导航栏 buttons 时触发
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				uni.showToast({
					title:"记得手动打开gps",
					icon:"none"
				})
				this.getLocation()
			} else if (index === 1 ) {
				if(this.$store.state.user.hasLogin){
					uni.navigateTo({
						url:'/pages/chat/chat'
					})
				}else{
					uni.$u.toast('登录后可查看')
				}
			}
		},
		
		// #endif
	}
</script>

<style lang="scss">
	/*#ifdef MP */
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
	/* 头部 view */
	.carousel-section {
		position: relative;
		padding-top: 10upx;
		// height: 500upx;
		.titleNview-placing {
			/* #ifdef APP */
			height: var(--status-bar-height);
			/* #endif */
			padding-top: 75upx;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			/* #ifdef APP */
			height: 620upx;
			/* #endif */
			/* #ifdef H5 */
			height: 570upx;
			/* #endif */
			transition: .6s;
		}
	}
	// swiper 元素
	.carousel {
		display:block;
		margin: 5% auto;
		width: 92%;
		height: 400upx;
		// swiper item元素
		.carousel-item {
			width: 100%;
			height: 100%;
			// padding-top: 0;
			// overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
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
			// box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
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
		.ltsItem{
			border-radius: 20upx;
			background-color:antiquewhite;
			color:rgba(138, 109, 108, 1.0);
			height:130upx;flex: 1;margin: 20upx;
			border-color:white;
			border-style: solid;text-align: center;
		}
		image{
			position: absolute;
			margin: 0 auto;
			left:0; right:0; 
			//position: absolute;居中连击
		}
	}
	
</style>
