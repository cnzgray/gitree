import Vue from 'vue'
import '@/plugins/element'
import App from './App.vue'

// @ts-ignore
global.browser = require('webextension-polyfill')

document.addEventListener(
  'DOMContentLoaded',
  e => {
    console.log('DOMContentLoaded')
    const div = document.createElement('div')
    document.body.appendChild(div)

    new Vue({
      el: div,
      render: h => h(App)
    })
  },
  false
)
