import Vue from 'vue'
import '@/plugins/element'
import App from './App.vue'

global.browser = require('webextension-polyfill')

new Vue({
  el: '#app',
  render: h => h(App)
})
