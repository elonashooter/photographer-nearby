import user from '@/store/modules/user.js'
import chat from '@/store/modules/chat.js'
// #ifndef VUE3
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	modules: {
		user,
		chat
	},
	strict: true
	
})
// #endif

// #ifdef VUE3
import {createStore} from 'vuex'
const store = createStore({
	modules: {
		user,
		chat
	}
})
// #endif

export default store