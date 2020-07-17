import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import App from './App.vue'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(VueAnalytics, {
  id: process.env.VUE_APP_GA_ID,
  set: [
    { field: 'anonymizeIp', value: true }
  ]
})

new Vue({
  render: h => h(App),
}).$mount('#app')
