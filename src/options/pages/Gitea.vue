<template>
  <div v-loading="loading">
    <div class="profile" v-for="(profile, index) in profiles" :key="index">
      <h3>{{ `Gitea站点 ${index + 1}` }}</h3>
      <el-form label-width="200px" class="form">
        <el-form-item label="Gitea Url">
          <el-input v-model="profile.url" placeholder="https://your_site"></el-input>
        </el-form-item>
        <el-form-item label="Access Key">
          <el-input v-model="profile.accessKey" placeholder="Your Gitea Access Key"></el-input>
        </el-form-item>
        <el-form-item><el-button @click.prevent="removeProfile(index)">删除</el-button></el-form-item>
      </el-form>
    </div>

    <div class="btns">
      <el-button @click.prevent="addProfile()">添加Gitea站点</el-button>
      <el-button type="primary" @click="saveProfile">保存</el-button>
    </div>
  </div>
</template>

<script>
import { GiteaStore } from '@/store'
import { requestPermissions } from '../message'
import { DEFAULT_GITEA_PROFILE } from '../const'

export default {
  data() {
    return {
      loading: true,
      profiles: []
    }
  },
  created() {
    // 还原所有的Profiles
    this.restoreProfile()
  },
  methods: {
    restoreProfile() {
      GiteaStore.loadData().then(profiles => {
        this.profiles = profiles || []
        this.loading = false
      })
    },
    saveProfile() {
      this.profiles = this.profiles.filter(p => p.url)
      GiteaStore.saveData(this.profiles)
        .then(requestPermissions)
        .then(granted => {
          alert('保存成功')
        })
    },
    addProfile() {
      this.profiles.push({ ...DEFAULT_GITEA_PROFILE })
    },
    removeProfile(index) {
      if (index !== -1) this.profiles.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.profile {
  border: 1px solid #ebebeb;
  border-radius: 3px;
  margin-bottom: 10px;

  h3 {
    font-size: 16px;
    font-weight: normal;
    margin: 0;
    padding: 1em;
    border-bottom: 1px solid #ebebeb;
    text-align: center;
  }

  .form {
    &.el-form {
      margin: 10px;
      width: 800px;
    }
    .el-input {
      width: 500px;
    }
  }
}
.btns {
  text-align: center;
}
</style>
