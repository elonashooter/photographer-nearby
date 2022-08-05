import App from './App'
import store from './store'
import i18n from './lang/i18n'


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.odb=uniCloud.database().collection('photography-order')
Vue.prototype.pdb=uniCloud.database().collection('photographer')
Vue.prototype.ppdb=uniCloud.database().collection('pre-photographer')//申请中的摄影师
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
