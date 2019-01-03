<template>
  <span class="custom-tree-node" slot-scope="{ node, data }">
    <span v-if="data.type === 'tree'">
      <octicon icon="file-directory"></octicon>
      <span class="caption">{{ data.text }}</span>
    </span>

    <span v-if="data.type === 'blob'">
      <octicon icon="file"></octicon>
      <span class="caption">{{ data.text }}</span>
    </span>

    <span v-if="data.type === 'commit'">
      <octicon icon="file-submodule"></octicon>
      <span class="caption">
        <a :href="`${data.href}`">{{ data.text }}</a>
        <span>@</span>
        <a :href="`${data.href}/tree/${data.sha}`">{{ data.sha.substr(0, 7) }}</a>
      </span>
    </span>
  </span>
</template>

<script>
import Octicon from '@/content/components/Octicon'

export default {
  props: ['repo', 'data', 'node'],
  components: { Octicon }
}
</script>

<style lang="scss">
.custom-tree-node {
  .octicon-file {
    color: rgba(3, 47, 98, 0.5);
  }
  .octicon-file-submodule {
    color: rgba(3, 47, 98, 0.5);
  }
  .octicon-file-directory {
    color: rgba(3, 47, 98, 0.5);
  }
  .gitree-icon {
    display: inline-block;
    width: 16px;
  }

  .caption,
  .caption > a {
    color: #0366d6;
    text-decoration: none;
  }
}
</style>
