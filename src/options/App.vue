<template>
  <el-tabs v-if="loaded" active-name="github">
    <el-tab-pane label="GITHUB" name="github">
      <el-form label-position="top" label-width="80px">
        <el-form-item label="Github配置"><el-input type="textarea" v-model="profiles.github"></el-input></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveProfile('github', profiles.github)">save</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="GITEA" name="gitea">
      <el-form label-position="top" label-width="80px">
        <el-form-item label="Gitea配置"><el-input type="textarea" v-model="profiles.gitea"></el-input></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveProfile('gitea', profiles.gitea)">save</el-button>
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="GOGS" name="gogs">gogs</el-tab-pane>
  </el-tabs>
</template>

<script>
import { GithubStore, GiteaStore } from '@/store'

export default {
  name: 'App',
  data() {
    return {
      loaded: false,
      profiles: {
        github: '',
        gitea: ''
      }
    }
  },
  created() {
    // 还原所有的Profiles
    this.restoreProfiles()
  },
  methods: {
    restoreProfiles() {
      Promise.all([GithubStore.loadData(), GiteaStore.loadData()]).then(([github, gitea]) => {
        this.profiles.github = JSON.stringify(github || { accessKey: '', urls: [] })
        this.profiles.gitea = JSON.stringify(gitea || [{ accessKey: '', url: '' }])
        this.loaded = true
      })
    },
    saveProfile(type, value) {
      const save = () => {
        switch (type) {
          case 'github':
            return GithubStore.saveData(JSON.parse(value))
          case 'gitea':
            return GiteaStore.saveData(JSON.parse(value))
        }
      }
      save()
        .then(() => alert('save success!'))
        .then(() => Promise.all([GithubStore.loadData(), GiteaStore.loadData()]))
        .then(([github, gitea]) => {
          const urls = [].concat(github.urls).concat(gitea.map(v => v.url))
          chrome.runtime.sendMessage('requestPermissions', { urls })
        })
    }
  }
}
</script>
