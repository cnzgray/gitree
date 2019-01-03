<template>
  <sidebar v-if="sidebar.show" v-loading="sidebar.loading" :width="sidebar.width">
    <component slot="header" :is="headerComponent" :repo="gitrepo"></component>
    <template>
      <el-tree
        ref="tree"
        :data="treedata"
        :props="defaultProps"
        :highlight-current="true"
        :lazy="adapter.lazy"
        :load="lazyLoad"
        node-key="path"
        @node-click="nodeClick"
      >
        <component
          slot-scope="{ node, data }"
          :is="nodeComponent"
          :repo="gitrepo"
          :node="node"
          :data="data"
        ></component>
      </el-tree>
    </template>
  </sidebar>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import { createAdapter } from './adapter'
import Pjax from 'pjax'
import { resolve } from 'path'

export default {
  name: 'App',
  data() {
    return {
      sidebar: { width: 340, show: false, loading: false },
      treedata: [],
      defaultProps: {
        children: 'children',
        isLeaf(data, node) {
          return data.type !== 'tree'
        }
      },
      adapter: null,
      gitrepo: null
    }
  },
  computed: {
    headerComponent() {
      if (this.adapter && this.gitrepo) return this.adapter.HeaderComponent
    },
    nodeComponent() {
      if (this.adapter && this.gitrepo) return this.adapter.NodeComponent
    }
  },
  created() {
    // 创建adapter
    createAdapter()
      .then(adapter => {
        this.adapter = adapter
        return adapter.parseRepo()
      })
      .then(repo => {
        this.gitrepo = repo
        this.sidebar.show = true
        this.sidebar.loading = true
        return this.adapter.loadCodeTree(repo)
      })
      .then(nodes => {
        sortNodes(nodes)
        this.treedata = nodes
        return this.adapter.detectCurrentPath()
      })
      .then(path => {
        if (path) {
          const $tree = this.$refs.tree
          const currentNode = $tree.getNode(path)
          if (currentNode) {
            $tree.setCurrentKey(path)
            currentNode.expand(null, true)
          } else {
            breakPath(path)
              .map(path => resolve => {
                const node = $tree.getNode(path)
                if (node && node.isLeaf === false) node.expand(resolve)
                else resolve()
              })
              .reduce((promiseChain, currentFunction) => {
                return promiseChain.then(() => new Promise(currentFunction))
              }, Promise.resolve())
              .then(() => $tree.setCurrentKey(path))
          }
        }

        this.sidebar.loading = false
      })
      .catch(error => {
        if (error) console.warn(error.message, error)
      })

    // binding pjax event
    document.addEventListener('pjax:send', () => (this.sidebar.loading = true))
    document.addEventListener('pjax:complete', () => (this.sidebar.loading = false))
  },
  components: { Sidebar },
  methods: {
    nodeClick(data, node) {
      if (data.type !== 'blob') return
      this.adapter.selectFile(this.gitrepo, data)
    },
    lazyLoad(node, resolve) {
      if (this.sidebar.loading) return
      this.adapter.loadCodeTree(this.gitrepo, node.data).then(nodes => {
        sortNodes(nodes)
        resolve(nodes)
      })
    }
  }
}

function sortNodes(nodes) {
  nodes.sort((a, b) => {
    if (a.type === b.type) return a.text === b.text ? 0 : a.text < b.text ? -1 : 1
    return a.type === 'blob' ? 1 : -1
  })

  nodes.forEach(item => {
    if (item.type === 'tree' && item.children !== true && item.children.length > 0) {
      sortNodes(item.children)
    }
  })
}

// converts ['a/b'] to ['a', 'a/b']
function breakPath(fullPath) {
  return fullPath.split('/').reduce((res, path, idx) => {
    res.push(idx === 0 ? path : res[idx - 1] + '/' + path)
    return res
  }, [])
}
</script>
<style lang="scss">
.gitree-sidebar {
  @import './components/octicon.scss';

  .el-tree-node__content > * {
    flex: none; // 保持元素的默认尺寸
  }
  .el-tree {
    display: inline-block; // 让tree的宽度适配内容宽度
    min-width: 100%; // 默认宽度
  }
  a {
    text-decoration: none;
  }
}
</style>
