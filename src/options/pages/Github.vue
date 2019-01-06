<template>
  <div v-loading="loading">
    <el-form label-width="200px" class="form">
      <el-form-item label="Access Key">
        <el-input v-model="profile.accessKey" placeholder="Your Github Access Key"></el-input>
        <a style="color:red" href="https://github.com/settings/tokens">Generate Access Key</a>
      </el-form-item>
      <el-form-item v-for="(url, index) in profile.urls" :label="`Enterprise URL ${index + 1}`" :key="index">
        <el-input v-model="profile.urls[index]" placeholder="https://your_site"></el-input>
        <el-button @click.prevent="removeUrl(index)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click.prevent="addUrl()">添加企业地址</el-button>
        <el-button type="primary" @click="saveProfile">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { GithubStore } from '@/store'
import { requestPermissions } from '../message'
import { DEFAULT_GITHUB_PROFILE } from '../const'

export default {
  data() {
    return {
      loading: true,
      profile: {}
    }
  },
  created() {
    // 还原所有的Profiles
    this.restoreProfile()
  },
  methods: {
    restoreProfile() {
      GithubStore.loadData().then(profile => {
        this.profile = {
          ...DEFAULT_GITHUB_PROFILE,
          ...profile
        }
        this.loading = false
      })
    },
    saveProfile() {
      if (this.profile.urls) this.profile.urls = this.profile.urls.filter(v => v)
      GithubStore.saveData(this.profile)
        .then(requestPermissions)
        .then(granted => {
          alert('保存成功')
        })
    },
    addUrl() {
      if (this.profile.urls) this.profile.urls.push('')
    },
    removeUrl(index) {
      if (this.profile.urls && index !== -1) this.profile.urls.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  &.el-form {
  }
  .el-input {
    width: 500px;
  }
}
</style>
