import Vue from 'vue'
import VueGtag from 'vue-gtag'
import App from './App.vue'
import './registerServiceWorker'
import './generated/spritesheet.css'

Vue.config.productionTip = false
const isDev = process.env.NODE_ENV !== 'production'
Vue.config.devtools = isDev
Vue.config.performance = isDev

Vue.use(VueGtag, {
  config: {
    id: process.env.VUE_APP_GA_ID,
    params: {
      send_page_view: true,
      anonymize_ip: true
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
