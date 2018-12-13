<template>
  <sidebar :width="sidebar.width">
    <template slot="header">
      header
    </template>

    <template>
      sidebar
    </template>
  </sidebar>
</template>

<script>
import Sidebar from './components/Sidebar';

export default {
  name: 'App',
  data() {
    return {
      sidebar: { width: 340 },
    };
  },
  components: { Sidebar },
};
</script>

<style lang="scss"></style>
