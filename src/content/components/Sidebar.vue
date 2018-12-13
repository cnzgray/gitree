<template>
  <div class="gitree-sidebar" :style="{ width: this.width + 'px' }">
    <a class="toggle" @click="toggle"> <fa-icon icon="coffee" size="lg" /> </a>
    <div class="views">
      <div class="view-header"><slot name="header"></slot></div>
      <div class="view-body"><slot></slot></div>
    </div>
  </div>
</template>

<script>
import store from '@utils/store';
import { hasClass, toggleClass } from '@utils/dom';
const $html = document.getElementsByTagName('html')[0];

export default {
  name: 'App',
  props: {
    width: {
      type: Number,
      default: 340,
      required: false,
    },
  },
  mounted() {
    this.toggle();
  },
  methods: {
    toggle() {
      toggleClass($html, 'gitree-sidebar-show');
      $html.style.marginLeft = hasClass($html, 'gitree-sidebar-show') ? `${this.width}px` : '';
    },
  },
};
</script>

<style lang="scss">
.gitree-sidebar {
  position: fixed !important;
  overflow: visible;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  border-right: 1px solid #ddd;
  z-index: 1000001;
  transition: transform 0.2s ease;
  transform: translate3d(-100%, 0, 0);

  padding-top: 54px;
  background-color: rgb(247, 247, 247);
  border-right: none;

  a.toggle {
    position: absolute !important;
    text-align: center;
    line-height: 1;
    cursor: pointer;
    z-index: 1000003;
    top: 12px;
    right: -35px;
  }

  .views {
    height: 100%;
    overflow: auto;

    .view-header {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      font-size: 16px;
      line-height: 2.6;
      margin: 0;
      text-shadow: 0 1px 0 #fff;
      z-index: 1000002;
    }
  }
}

html.gitree-sidebar-show .gitree-sidebar {
  transform: translate3d(0, 0, 0);

  a.toggle {
    right: 12px;
    top: 12px;
  }
}
</style>
