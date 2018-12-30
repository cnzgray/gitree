<template>
  <div class="gitree-sidebar" :style="{ width: this.width + 'px' }">
    <a class="toggle" @click="toggle"><i :class="toggleClass"></i></a>
    <div class="views">
      <div class="view-header"><slot name="header"></slot></div>
      <div class="view-body"><slot></slot></div>
    </div>
  </div>
</template>

<script>
import { hasClass, toggleClass } from '@/utils/dom'
const $html = document.getElementsByTagName('html')[0]

export default {
  name: 'App',
  data() {
    return {
      show: false
    }
  },
  props: {
    width: {
      type: Number,
      default: 340,
      required: false
    }
  },
  mounted() {
    this.toggle()
  },
  computed: {
    toggleClass() {
      return this.show ? 'el-icon-arrow-left' : 'el-icon-arrow-right'
    }
  },
  methods: {
    toggle() {
      toggleClass($html, 'gitree-sidebar-show')
      $html.style.marginLeft = hasClass($html, 'gitree-sidebar-show') ? `${this.width}px` : ''
      this.show = !this.show
    }
  }
}
</script>

<style src="./Sidebar.scss"></style>
