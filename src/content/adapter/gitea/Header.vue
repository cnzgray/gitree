<template>
  <div>
    <div class="repo">
      <octicon icon="repo" :height="16"></octicon>
      <a :href="userUrl">{{ repo.username }}</a>
      <span>/</span>
      <a :href="repoUrl">{{ repo.reponame }}</a>
    </div>
    <div class="branch">
      <octicon icon="git-branch" :height="13"></octicon>
      <span>{{ repo.branch }}</span>
    </div>
  </div>
</template>

<script>
import Octicon from '@/content/components/Octicon'

export default {
  props: ['repo'],
  components: { Octicon },
  computed: {
    userUrl() {
      return `/${this.repo.username}`
    },
    repoUrl() {
      return `/${this.repo.username}/${this.repo.reponame}`
    }
  }
}
</script>

<style lang="scss" scoped>
.repo,
.branch {
  padding-right: 55px;

  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  .octicon {
    width: 16px;
    text-align: center;
    color: rgba(3, 47, 98, 0.5);
  }
}

.repo {
  font-size: 13px;
}

.branch {
  font-size: 11px;
}
</style>
