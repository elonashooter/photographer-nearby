import App from './App'
import store from './store'
import i18n from './lang/i18n'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.checkPermission=async function(){
		let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
			await permision.requestAndroid('android.permission.READ_EXTERNAL_STORAGE');
		if (status === null || status === 1) {
			status = 1;
		} else {
			uni.showModal({
				content: "检测到未开启相册权限",
				confirmText: "设置",
				success: function(res) {
					if (res.confirm) {
						permision.gotoAppSetting();
					}
				}
			})
		}
		return status;
	}

App.mpType = 'app'
const app = new Vue({
	i18n,
	store,
	...App
})
app.$mount()
// #endif


// #ifdef VUE3
import {createSSRApp} from 'vue'

export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	app.use(store)
	return {app}
}
// #endif
