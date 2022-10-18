<template>
	<view class="about">
		<view class="box">
			<image class="logoImg" src="/static/11NoBgNoCut.png"></image>
			<text class="tip appName">{{about.appName}}</text>
			<text class="tip">Version {{version}}</text>
			<!--Sansnn-uQRCode组件来源，插件市场：https://ext.dcloud.net.cn/plugin?id=1287 微调后-->
			<uqrcode ref="uqrcode" canvas-id="qrcode" :value="apkUrl" :options="{ margin: 20 }" @click='remakescan()' :start="false"></uqrcode>
			<text class="tip">{{$t('about.sacnQR')}} {{about.appName}} {{$t('about.client')}}</text>
		</view>
		<view class="copyright">
			<view class="agreement-box" v-for="(agreement,index) in about.agreements" :key="index">
				<text class="agreement" @click="navigateTo(agreement)">《{{agreement.title}}》</text>
				<text class="hint" v-if="about.agreements.length-1>index">{{$t('about.and')}}</text>
			</view>
			<text class="hint">Copyright © {{year}}</text>
			<text class="hint">{{about.company}}</text>
		</view>
	</view>
</template>
<script>
// #ifdef APP
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare()
// #endif
	export default {
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
		onLoad() {
			// #ifdef APP-PLUS
			this.version = plus.runtime.version
			// #endif
			this.getApkUrl()
		},
		computed: {
			uniStarterConfig() {
				console.log(getApp());
				return getApp().globalData.config
			}
		},
		data() {
			return {
				version: "V1.0.0",
				year: "2020",
				about: {},
				apkUrl:'',
			};
		},
		created() {
			this.about = this.uniStarterConfig.about
			uni.setNavigationBarTitle({
				title: this.$t('about.about')+ " " + this.about.appName
			})
			this.year = (new Date).getFullYear()
		},
		onNavigationBarButtonTap() {
			let {
				download,
				appName,
				slogan,
				logo
			} = this.about
			uniShare.show({
				content: { //公共的分享类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
					type: 0,
					href: download,
					title: appName,
					summary: slogan,
					imageUrl: logo + '?x-oss-process=image/resize,m_fill,h_100,w_100' //压缩图片解决，在ios端分享图过大导致的图片失效问题
				},
				menus: [{
						"img": "/static/app-plus/sharemenu/wechatfriend.png",
						"text": this.$t('common').wechatFriends,
						"share": {
							"provider": "weixin",
							"scene": "WXSceneSession"
						}
					},
					{
						"img": "/static/app-plus/sharemenu/wechatmoments.png",
						"text":  this.$t('common').wechatBbs,
						"share": {
							"provider": "weixin",
							"scene": "WXSceneTimeline"
						}
					},
					{
						"img": "/static/app-plus/sharemenu/weibo.png",
						"text":  this.$t('common').weibo,
						"share": {
							"provider": "sinaweibo"
						}
					},
					{
						"img": "/static/app-plus/sharemenu/qq.png",
						"text": "QQ",
						"share": {
							"provider": "qq"
						}
					},
					{
						"img": "/static/app-plus/sharemenu/copyurl.png",
						"text": this.$t('common').copy,
						"share": "copyurl"
					},
					{
						"img": "/static/app-plus/sharemenu/more.png",
						"text": this.$t('common').more,
						"share": "shareSystem"
					}
				],
				cancelText: this.$t('common').cancelShare,
			}, e => { //callback
				console.log(e);
			})
		},
		methods: {
			navigateTo({
				url,
				title
			}) {
				uni.navigateTo({
					url: '/pages/common/webview/webview?url=' + url + '&title=' + title,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			getApkUrl(){
				uniCloud.database().collection('opendb-app-versions').where({appid:'__UNI__B2F4D33'})
				.orderBy('version').get().then(e=>{
					if(e.result.data.length>0){
						this.apkUrl=e.result.data[e.result.data.length-1].url
						this.$refs.uqrcode.make()
					}
					
				})
			},
			remakescan(){
				this.$refs.uqrcode.remake({
				  success: () => {
				    console.log('生成成功');
				  },
				  fail: err => {
				    console.log(err)
				  }
				});
			}
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
	/* #endif */
	.about {
		width: 750rpx;
		flex-direction: column;
	}

	.box {
		background-color: #2285ff;
		margin-top: 60px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.logoImg {
		margin-bottom: 10rpx;
		width: 160rpx;
		height: 160rpx;
		border-radius: 15px;
	}

	.tip {
		text-align: center;
		font-size: 24rpx;
		margin-top: 10px;
		padding: 10rpx;
	}

	.appName {
		margin-top: 0px;
		font-size: 42rpx;
		font-weight: 500;
	}

	.copyright {
		width: 750rpx;
		font-size: 32rpx;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		bottom: 20px;
		left: 0;
		position: fixed;
	}

	.agreement-box {
		justify-content: center;
	}

	.agreement {
		color: #2285ff;
		font-size: 26rpx;
	}

	.hint {
		text-align: center;
		color: #999999;
		font-size: 26rpx;
	}
</style>
