<template>
  <div>
    <div>
      <h2>Github Config</h2>
      <div>
        <div>
          <label>Access Token</label>
        </div>
        <input type="text" v-model="github.accessKey" placeholder="Access Token">
      </div>
      <div>
        <div>
          <label>GitHub Enterprise URLs</label>
        </div>
        <textarea
          rows="5"
          cols="40"
          v-model="githubUrls"
          placeholder="https://git.your_site1
https://git.your_site2"
        ></textarea>
      </div>
    </div>

    <div>
      <h2>Gitea Config</h2>
      <div>
        <div>
          <label>Access Token</label>
        </div>
        <input type="text" v-model="gitea.accessKey" placeholder="Access Token">
      </div>
      <div>
        <div>
          <label>Gitea Self Host URLs</label>
        </div>
        <textarea
          rows="5"
          cols="40"
          v-model="giteaUrls"
          placeholder="https://git.your_site1
https://git.your_site2"
        ></textarea>
      </div>
    </div>
    <button @click="save">保存</button>
  </div>
</template>

<script>
import store from '@utils/store';

export default {
  name: 'App',
  data() {
    return {
      github: { accessKey: null, urls: [] },
      gitea: { accessKey: null, urls: [] },
    };
  },
  computed: {
    githubUrls: {
      get() {
        return this.github.urls.join('\n');
      },
      set(value) {
        this.github.urls = value.split('\n');
      },
    },
    giteaUrls: {
      get() {
        return this.gitea.urls.join('\n');
      },
      set(value) {
        this.gitea.urls = value.split('\n');
      },
    },
  },
  created() {
    this.github = store.tryGet('github', () => this.$data.github);
    this.gitea = store.tryGet('gitea', () => this.$data.gitea);
  },
  methods: {
    save() {
      store.set('github', { accessKey: this.github.accessKey, urls: this.github.urls });
      store.set('gitea', { accessKey: this.gitea.accessKey, urls: this.gitea.urls });
      this.requestPermission();
      alert('save success!');
      // chrome.runtime.sendMessage({ type: 'requestPermissions', urls: [`${this.github.accessKey}/*`] }, granted => {
      //   console.log(granted);
      // });
    },
    requestPermission() {
      const urls = [].concat(this.github.urls).concat(this.gitea.urls);
      chrome.runtime.sendMessage({ type: 'requestPermissions', urls: urls }, granted => {
        // console.log(granted);
        alert(granted)
      });
    },
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
