<script>
	import initApp from '@/common/appInit.js';
	import openApp from '@/common/openApp.js';
	import checkIsAgree from '@/pages/uni-agree/utils/uni-agree.js';
	import uView from '@/uni_modules/uview-ui';
	export default {
		globalData: {
			searchText: '',
			appVersion: {},
			config: {},
			$i18n: {},
			$t: {}
		},
		onLaunch: function() {
			// #ifdef APP-PLUS
			uni.onPushMessage((res) => {
				//4种情况  摄影师接单 摄影师接单得到确认  用户预约  用户预约得到确认
				uni.navigateTo({
					url:"pages/order/fab?bothMsg="+encodeURIComponent(JSON.stringify(res.data))
				})
				// uni.createPushMessage({
				// 	title:res.data.title,
				// 	content:res.data.content,
				// 	sound:'system'
				// })
			});
			// #endif
			console.log('App Launch')
			this.globalData.$i18n = this.$i18n
			this.globalData.$t = str => this.$t(str)

			initApp();
			
			// #ifdef H5
				openApp() //创建在h5端全局悬浮引导用户下载app的功能
			// #endif


		},
		onShow: function() {
			console.log('App Show')
			//推送监听

			//推送监听end
		},
		onHide: function() {
			// if(this.$store.state.user.OnlineStatus){
			// 	uni.$u.toast('请摄影师下线后再退出')
			// } 
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "common/demo.scss";
</style>
