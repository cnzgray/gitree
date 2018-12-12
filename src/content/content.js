alert("hello world!");
import Vue from 'vue';
import App from './App';

global.browser = require('webextension-polyfill');
const { name } = require('~/manifest.json')

document.addEventListener('DOMContentLoaded', e => {
    const siderbar = document.createElement("div");
    siderbar.className = `${name}-siderbar`
    document.body.appendChild(siderbar);
    console.log(1)

    /* eslint-disable no-new */
    new Vue({
        el: siderbar,
        render: h => h(App),
    });
}, false);

