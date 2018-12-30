import Vue from 'vue'
// @ts-ignore
import octicons from 'octicons'

export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  },
  render(h) {
    const icon = octicons[this.icon]
    const size = {}
    if (this.width && this.height) {
      size.width = this.width
      size.height = this.height
    } else if (this.width && this.height == null) {
      size.width = this.width
      size.height = (icon.height / icon.width) * this.width
    } else if (this.width == null && this.height) {
      size.width = (icon.width / icon.height) * this.height
      size.height = this.height
    }
    if (icon)
      return h('svg', {
        attrs: {
          ...icon.options,
          ...size
        },
        domProps: {
          innerHTML: icon.path
        }
      })
  }
}
