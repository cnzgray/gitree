<template>
  <el-row>
    <el-col :span="16" :offset="4">
      <el-tabs active-name="github" class="options">
        <el-tab-pane label="GITHUB" name="github"><github></github></el-tab-pane>
        <el-tab-pane label="GITEA" name="gitea"><gitea></gitea></el-tab-pane>
        <el-tab-pane label="GOGS" name="gogs">暂不支持</el-tab-pane>
        <el-tab-pane label="OSCHINA/GITEE" name="oschina">暂不支持</el-tab-pane>
        <el-tab-pane label="GITLAB" name="gitlab">暂不支持</el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import Github from './pages/Github.vue'
import Gitea from './pages/Gitea.vue'

export default {
  name: 'App',
  components: { Github, Gitea }
}
</script>

<style lang="scss" scoped>
.options {
  width: 900px;
}
</style>
