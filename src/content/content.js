import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App';

library.add(faCoffee);
Vue.component('fa-icon', FontAwesomeIcon);

global.browser = require('webextension-polyfill');

document.addEventListener(
  'DOMContentLoaded',
  e => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    /* eslint-disable no-new */
    new Vue({
      el: div,
      render: h => h(App),
    });
  },
  false
);
