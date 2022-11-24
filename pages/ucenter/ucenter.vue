<template>
	<view class="center">
		<uni-sign-in ref="signIn"></uni-sign-in>
		<view class="userInfo" @click.capture="toUserInfo">
			<cloud-image width="150rpx" height="150rpx" v-if="userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url" :option="{margin:10}"></cloud-image>
			<image v-else class="logo-img" src="@/static/uni-center/defaultAvatarUrl.png"></image>
			<view class="logo-title">
				<text class="uer-name" v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
				<text class="uer-name" v-else>{{$t('mine.notLogged')}}</text>
			</view>
		</view>
		<view class="" v-if="character=='phoer'">
			<view class="cate-section" >
				<view class="cate-item" >
					<image src="/static/temp/jrwp2.png" @tap="toPhoer()"></image>
					<text>编辑自己</text>
					<u-switch v-model="OnlineStatus" @change="OnlineStatusChange" ></u-switch>
				</view>
			</view>
			<uni-grid class="grid" :column="4" :showBorder="false" :square="true">
				<uni-grid-item class="item" v-for="(item,index) in gridList" @click.native="tapGrid(index)" :key="index">
					<uni-icons class="icon" color="#ff5500" :type="item.icon" size="30"></uni-icons>
					<text class="text">{{item.text}}</text>
				</uni-grid-item>
			</uni-grid>
		</view>
		
		<view class="cate-section" v-else>
			<!-- 用户有三种状态：游客 普通 摄影师 -->
			<view class="cate-item" >
				<image src="/static/temp/jrwp1.png" @tap="toBePhoer"></image>
				<text>加入湾拍 </text>
			</view>
		</view>
		
		<uni-list class="center-list" v-for="(sublist , index) in ucenterList" :key="index">
			<uni-list-item v-for="(item,i) in sublist" :title="item.title" link :rightText="item.rightText" :key="i"
				:clickable="true" :to="item.to" @click="ucenterListClick(item)" :show-extra-icon="true"
				:extraIcon="{type:item.icon,color:'#999'}">
				<template v-slot:footer>
					<view v-if="item.showBadge" class="item-footer">
						<text class="item-footer-text">{{item.rightText}}</text>
						<view class="item-footer-badge"></view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<!-- 退出/登录 按钮 -->
<!-- 		<view class="bottom-back" @click="clickLogout">
			<text class="bottom-back-text" v-if="hasLogin">退出登陆</text>
			<text class="bottom-back-text" v-else>登陆</text>
		</view> -->
		<Wpage style="margin-top: 50upx;"></Wpage>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex';
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';
	// #ifdef APP
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';

	const uniShare = new UniShare()
	// #endif
	const db = uniCloud.database();
	import Wpage from '@/pages/WP_manager/Wpage.vue';
	export default {
		components:{Wpage},
		// #ifdef APP
		onBackPress({from}) {
			if(from=='backbutton'){
				this.$nextTick(function(){
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		// #endif
		data() {
			return {
				OnlineStatus:false,
				gridList: [
					// {
					// 	"text":'reget cid',
					// 	"icon":"map-pin"
					// },
					{  //没有场地 没法申请营业执照 没法使用支付相关功能
						"text": '收入',
						"icon": "wallet"
					},
					{
						"text": '接单',
						"icon": "notification"
					},
					{
						"text": '已接',
						"icon": "camera"
					},
					{
						"text": '润',
						"icon": "closeempty"
					},
				],
				ucenterList: [
					[
						// // #ifdef APP-PLUS
						// {
						// 	"title": this.$t('mine.signInByAd'),
						// 	"event": 'signInByAd',
						// 	"icon": "compose"
						// },
						// // #endif
						// {
						// 	"title": this.$t('mine.signIn'),
						// 	"event": 'signIn',
						// 	"icon": "compose"
						// },
						// // #ifdef APP-PLUS
						// {
						// 	"title": this.$t('mine.toEvaluate'),
						// 	"event": 'gotoMarket',
						// 	"icon": "hand-thumbsup"
						// },
						// //#endif
						// {
						// 	"title":this.$t('mine.readArticles'),
						// 	"to": '/pages/ucenter/read-news-log/read-news-log',
						// 	"icon": "flag"
						// },
						// {
						// 	"title": this.$t('mine.myScore'),
						// 	"to": '',
						// 	"event": 'getScore',
						// 	"icon": "paperplane"
						// }
					// 	// #ifdef APP-PLUS
					// 	, {
					// 		"title": this.$t('mine.invite'),
					// 		"event": 'share',
					// 		"icon": "redo"
					// 	}
					// 	// #endif
					],
					[{
						"title": "我的账号",
						"to": '/pages/ucenter/settings/settings',
						"icon": "gear"
					},{
						"title": this.$t('mine.feedback'),
						"to": '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback',
						"icon": "help"
					},{
						"title": "支持湾拍",
						"to": '/pages/home/supportWP',
						"icon": "hand-up"
					}],
					// [{
					// 	"title": this.$t('mine.about'),
					// 	"to": '/pages/ucenter/about/about',
					// 	"icon": "info"
					// }]
				],
				listStyles: {
					"height": "150rpx", // 边框高度
					"width": "150rpx", // 边框宽度
					"border": { // 如果为 Boolean 值，可以控制边框显示与否
						"color": "#eee", // 边框颜色
						"width": "1px", // 边框宽度
						"style": "solid", // 边框样式
						"radius": "100%" // 边框圆角，支持百分比
					}
				}
			}
		},
		onLoad() {
			// console.log(313,this.userInfo,this.hasLogin);
			//#ifdef APP-PLUS
			this.ucenterList[this.ucenterList.length - 2].unshift({
				title:this.$t('mine.checkUpdate'),// this.this.$t('mine.checkUpdate')"检查更新"
				rightText: this.appVersion.version + '-' + this.appVersion.versionCode,
				event: 'checkVersion',
				icon: 'loop',
				showBadge: this.appVersion.hasNew
			})
			//#endif
			
		},
		computed: {
			...mapGetters({
				userInfo: 'user/info',
				hasLogin: 'user/hasLogin',
				WP_manager:'user/WP_manager',
				character:'user/character'
			})
			// #ifdef APP-PLUS
			,
			appVersion() {
				return getApp().appVersion
			}
			// #endif
			,
			// 市场评分
			// appConfig() {
			// 	return getApp().globalData.config
			// }
		},
		methods: {
			...mapMutations({
				setUserInfo: 'user/login'
			}),
			...mapActions({
				logout: 'user/logout'
			}),
			OnlineStatusChange(){
				uniCloud.database().collection('photographer').where({userId:this.userInfo._id}).update({
					OnlineStatus:this.OnlineStatus
				}).then(()=>{
					if(this.OnlineStatus){
						uni.showToast({
							title:'进入接单状态'
						})
					}else{
						uni.$u.toast('离开接单状态')
					}
					this.$store.commit('user/OnlineStatus',this.OnlineStatus)
					console.log(this.$store.state.user.OnlineStatus);
				})
			},
			//加入湾拍
			toBePhoer(){
				uni.navigateTo({
					url: '/pages/photographer/pre-phoer'
				});
			},
			//编辑自己
			toPhoer(){
				uni.navigateTo({
					url: '/pages/photographer/pre-phoer?phoerId='+this.userInfo._id
				});
			},
			// clickLogout() {
			// 	if (this.hasLogin) {
			// 		uni.showModal({
			// 			title: "退出提示",
			// 			content: "确定退出登陆？",
			// 			cancelText: "取消",
			// 			confirmText: "确定",
			// 			success: res => {
			// 				if (res.confirm) {
			// 					this.logout()
			// 					uni.navigateBack();
			// 				}
			// 			},
			// 			fail: () => {},
			// 			complete: () => {}
			// 		});
			// 	} else {
			// 		uni.navigateTo({
			// 			url: '/pages/ucenter/login-page/pwd-login/pwd-login'
			// 		});
			// 	}
			// },
			toSettings() {
				uni.navigateTo({
					url: "/pages/ucenter/settings/settings"
				})
			},
			// signIn() { //普通签到
			// 	this.$refs.signIn.open()
			// },
			// signInByAd(){ //看激励视频广告签到
			// 	this.$refs.signIn.showRewardedVideoAd()
			// },
			/**
			 * 个人中心项目列表点击事件
			 */
			ucenterListClick(item) {
				if (!item.to && item.event) {
					this[item.event]();
				}
			},
			async checkVersion() {
				let res = await callCheckVersion()
				console.log(res);
				if (res.result.code > 0) {
					checkUpdate()
				} else {
					uni.showToast({
						title: res.result.message,
						icon: 'none'
					});
				}
			},
			toUserInfo() {
				uni.navigateTo({
					url: '/pages/ucenter/userinfo/userinfo'
				})
			},
			tapGrid(index) {
				if(index===0){
					// uni.getPushClientId({
					// 	success: (e) => {
					// 		// console.log(e);
					// 		uniCloud.database().collection('photographer').where({
					// 			userId:this.$store.state.user.info._id
					// 		}).update({
					// 			push_clientid:e.cid
					// 		}).then(e=>{
					// 			uni.$u.toast('成功更新识别码');
					// 		}).catch(e=>{
					// 			console.log(e);
					// 		})
					// 	}
					// })
					console.log('暂未开放');
				}
				else if(index===1){
					//摄影师查看所有用户已发布的预约列表
					uni.navigateTo({
						url: '/pages/order/orderList?phoerChoiceOrder=1'
					});
				}
				else if(index==2){
					//摄影师查看自己接的单
					uni.navigateTo({
						url: '/pages/order/orderList?phoerId='+this.userInfo._id
					});
				}
				else if(index==3){
					uni.navigateTo({
						url:'/pages/photographer/phoer-quit'
					})
				}
				
				
			},
			/**
			 * 去应用市场评分
			 */
			// gotoMarket() {
			// 	// #ifdef APP-PLUS
			// 	if (uni.getSystemInfoSync().platform == "ios") {
			// 		// 这里填写appstore应用id
			// 		let appstoreid = this.appConfig.marketId.ios; // 'id1417078253';
			// 		plus.runtime.openURL("itms-apps://" + 'itunes.apple.com/cn/app/wechat/' + appstoreid + '?mt=8');
			// 	}
			// 	if (uni.getSystemInfoSync().platform == "android") {
			// 		var Uri = plus.android.importClass("android.net.Uri");
			// 		var uri = Uri.parse("market://details?id=" + this.appConfig.marketId.android);
			// 		var Intent = plus.android.importClass('android.content.Intent');
			// 		var intent = new Intent(Intent.ACTION_VIEW, uri);
			// 		var main = plus.android.runtimeMainActivity();
			// 		main.startActivity(intent);
			// 	}
			// 	// #endif
			// },
			/**
			 * 获取积分信息
			 */
			// getScore() {
			// 	if (!this.userInfo) return uni.showToast({
			// 		title: this.$t('mine.checkScore'),
			// 		icon: 'none'
			// 	});
			// 	uni.showLoading({
			// 		mask: true
			// 	})
			// 	db.collection("uni-id-scores")
			// 		.where('"user_id" == $env.uid')
			// 		.field('score,balance')
			// 		.orderBy("create_date", "desc")
			// 		.limit(1)
			// 		.get()
			// 		.then((res) => {
			// 			console.log(res);
			// 			const data = res.result.data[0];
			// 			let msg = '';
			// 			msg = data ? (this.$t('mine.currentScore')+ data.balance) : this.$t('mine.noScore');
			// 			uni.showToast({
			// 				title: msg,
			// 				icon: 'none'
			// 			});
			// 		}).finally(()=>{
			// 			uni.hideLoading()
			// 		})
			// },
			// async share() {
			// 	let {
			// 		result
			// 	} = await uniCloud.callFunction({
			// 		name: 'uni-id-cf',
			// 		data: {
			// 			action: 'getUserInviteCode'
			// 		}
			// 	})
			// 	console.log(result);
			// 	let myInviteCode = result.myInviteCode || result.userInfo.my_invite_code
			// 	console.log(myInviteCode);
			// 	let {
			// 		appName,
			// 		logo,
			// 		company,
			// 		slogan
			// 	} = this.appConfig.about
			// 	// #ifdef APP-PLUS
			// 	uniShare.show({
			// 		content: { //公共的分享类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
			// 			type: 0,
			// 			href: this.appConfig.h5.url +
			// 				`/#/pages/ucenter/invite/invite?code=uniInvitationCode:${myInviteCode}`,
			// 			title: appName,
			// 			summary: slogan,
			// 			imageUrl: logo +
			// 				'?x-oss-process=image/resize,m_fill,h_100,w_100' //压缩图片解决，在ios端分享图过大导致的图片失效问题
			// 		},
			// 		menus: [{
			// 				"img": "/static/app-plus/sharemenu/wechatfriend.png",
			// 				"text": this.$t('common').wechatFriends,
			// 				"share": {
			// 					"provider": "weixin",
			// 					"scene": "WXSceneSession"
			// 				}
			// 			},
			// 			{
			// 				"img": "/static/app-plus/sharemenu/wechatmoments.png",
			// 				"text": this.$t('common').wechatBbs,
			// 				"share": {
			// 					"provider": "weixin",
			// 					"scene": "WXSceneTimeline"
			// 				}
			// 			},
			// 			{
			// 				"img": "/static/app-plus/sharemenu/weibo.png",
			// 				"text": this.$t('common').weibo,
			// 				"share": {
			// 					"provider": "sinaweibo"
			// 				}
			// 			},
			// 			{
			// 				"img": "/static/app-plus/sharemenu/qq.png",
			// 				"text": "QQ",
			// 				"share": {
			// 					"provider": "qq"
			// 				}
			// 			},
			// 			{
			// 				"img": "/static/app-plus/sharemenu/copyurl.png",
			// 				"text": this.$t('common').copy,
			// 				"share": "copyurl"
			// 			},
			// 			{
			// 				"img": "/static/app-plus/sharemenu/more.png",
			// 				"text": this.$t('common').more,
			// 				"share": "shareSystem"
			// 			}
			// 		],
			// 		cancelText: this.$t('common').cancelShare,
			// 	}, e => { //callback
			// 		console.log(e);
			// 	})
			// 	// #endif
			// }
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	page {
		background-color: #f8f8f8;
	}
	/* #endif*/

	.center {
		flex: 1;
		flex-direction: column;
		background-color: #f8f8f8;
	}

	.userInfo {
		width: 750rpx;
		padding: 20rpx;
		padding-top: 50px;
		background-image: url(../../static/uni-center/headers.png);
		flex-direction: column;
		align-items: center;
	}

	.logo-img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 150rpx;
	}

	.logo-title {
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
	}

	.uer-name {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 38rpx;
		color: #FFFFFF;
	}

	.center-list {
		margin-bottom: 30rpx;
		background-color: #f9f9f9;
	}

	.center-list-cell {
		width: 750rpx;
		background-color: #007AFF;
		height: 40rpx;
	}

	.grid {
		background-color: #FFFFFF;
		margin-bottom: 6px;
	}

	.uni-grid .text {
		font-size: 30rpx;
		height: 25px;
		line-height: 25px;
		color: #817f82;
	}

	.uni-grid .item ::v-deep .uni-grid-item__box {
		justify-content: center;
		align-items: center;
	}


	/*修改边线粗细示例*/
	/* #ifndef APP-NVUE */
	.center-list ::v-deep .uni-list--border:after {
		-webkit-transform: scaleY(0.2);
		transform: scaleY(0.2);
		margin-left: 80rpx;
	}

	.center-list ::v-deep .uni-list--border-top,
	.center-list ::v-deep .uni-list--border-bottom {
		display: none;
	}

	/* #endif */
	.item-footer {
		flex-direction: row;
		align-items: center;
	}

	.item-footer-text {
		color: #999;
		font-size: 24rpx;
		padding-right: 10rpx;
	}

	.item-footer-badge {
		width: 20rpx;
		height: 20rpx;
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-radius: 10rpx;
		/* #endif */
		background-color: #DD524D;
	}
	.bottom-back {
		margin-top: 10px;
		width: 750rpx;
		height: 44px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* #ifndef APP-NVUE */
		border: none;
		/* #endif */
		border-width: 0;
		border-radius: 0;
		background-color: #FFFFFF;
	}
	
	.bottom-back-text {
		font-size: 33rpx;
	}
	
	.cate-section {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30upx 22upx; 
		background: #fff;
		.cate-item {
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
</style>