<template>
  <g
    :class="inLink?'in-link':''"
    :transform="`translate(${currentNode.x}, ${currentNode.y})`">
    <g
      :class="{'is-active':true,'in-select':inSelect}">
      <rect
        :width="currentNode.width + 6"
        :height="currentNode.height + 6"
        rx="8"
        ry="8"
        :stroke="inSelect?'#FFEB3B':'#ccc'"
        stroke-width="4"
        stroke-linejoin="round"
        fill="rgba(255,255,255,0)"
        transform="translate(-3, -3)"></rect>
    </g>
    <!-- <g v-if="isLinkHandler">
      <circle
        :r="8*scale"
        fill="#616161"
        pointer-events="none"></circle>
    </g> -->
    <g
      v-if="!isLinkHandler"
      style="user-select: none;"
      cursor="move"
      @mousedown.left.stop="e => handleMouseDown(e, currentNode)">
      <rect
        class="g-box"
        :data-id="currentNode.id"
        :width="currentNode.width"
        :height="currentNode.height"
        rx="4"
        ry="4"
        :stroke="currentNode.borderColor||'#2e7d32'"
        stroke-width="2"
        stroke-linejoin="round"
        fill="rgba(255,255,255,0)">
      </rect>
      <slot pointer-events="none"></slot>
      <rect
        :width="8*scale"
        :height="8*scale"
        :stroke="currentNode.indicatorColor||'#2196F3'"
        :fill="currentNode.indicatorColor||'#2196F3'"
        cursor="pointer"
        :transform="`translate(${currentNode.width/2-4*scale}, ${currentNode.height-1})`"
        @mousedown.stop="e => handleStartLink(e, currentNode)">
      </rect>
    </g>
  </g>
</template>

<script>
import limitRange from './../lib/limitRange.js'

export default {
  name: 'FlowChartNode',
  props: {
    isLinkHandler: {
      type: Boolean,
      default: false
    },
    inLink: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      default: () => {}
    },
    currentNodeId: {
      type: String,
      default: ''
    },
    scale: {
      type: Number,
      default: 1
    },
    viewOffseX: {
      type: Number,
      default: 0
    },
    viewOffseY: {
      type: Number,
      default: 0
    },
    maxWidth: {
      type: Number,
      default: 0
    },
    maxHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentNode: {}
    }
  },
  computed: {
    inSelect() {
      return this.currentNodeId === this.node.id
    }
  },
  watch: {
    node: {
      immediate: true,
      deep: true,
      handler(node) {
        this.currentNode = Object.assign({}, node)
      }
    }
  },
  methods: {
    handleStartLink(e, currentNode) {
      const $svgContainer = this.$parent.$svgContainer

      this.$emit('in-link-change', true)
      const { offsetX, offsetY } = e
      const holder = this.createPlaceholder(
        currentNode.id,
        (offsetX + this.viewOffseX) * this.scale,
        (offsetY + this.viewOffseY) * this.scale
      )

      const handleMouseUp = e => {
        $svgContainer.removeEventListener('mousemove', handleMouseMove)
        $svgContainer.removeEventListener('mouseup', handleMouseUp)
        this.$emit('remove-node', holder.id)
        this.$emit('in-link-change', false)
        const targetId = e.target.getAttribute('data-id')
        if (targetId && targetId !== currentNode.id) {
          this.$emit('link-node', targetId, currentNode.id)
        }
      }

      const handleMouseMove = e => {
        this.handleMouseMove(e, holder, {
          x: this.viewOffseX,
          y: this.viewOffseY
        })
      }

      $svgContainer.addEventListener('mousemove', handleMouseMove)
      $svgContainer.addEventListener('mouseup', handleMouseUp)
    },
    handleMouseDown(e, currentNode) {
      const { x, y } = currentNode
      const { offsetX, offsetY } = e

      const offset = {
        x: x / this.scale - offsetX,
        y: y / this.scale - offsetY
      }

      const $svgContainer = this.$parent.$svgContainer

      const handleMoveEnd = () => {
        this.$emit('node-change', currentNode)
        $svgContainer.removeEventListener('mousemove', handleMouseMove)
        $svgContainer.removeEventListener('mouseup', handleMoveEnd)
        $svgContainer.removeEventListener('mouseleave', handleMoveEnd)
      }

      const handleMouseMove = e => {
        this.handleMouseMove(e, currentNode, offset)
      }

      $svgContainer.addEventListener('mousemove', handleMouseMove)
      $svgContainer.addEventListener('mouseup', handleMoveEnd)
      $svgContainer.addEventListener('mouseleave', handleMoveEnd)
    },
    handleMouseMove(e, currentNode, offset) {
      const { offsetX, offsetY } = e
      const { width, height } = currentNode
      const targetX = (offsetX + offset.x) * this.scale
      const targetY = (offsetY + offset.y) * this.scale

      const nodePositionLimited = limitRange({
        x: targetX,
        y: targetY,
        width,
        height
      }, 0, 0, this.maxWidth, this.maxHeight)

      Object.assign(currentNode, nodePositionLimited)
    },
    createPlaceholder(prevId, x, y) {
      const holder = {
        id: Math.random() + '',
        prevId,
        x,
        y,
        height: 0,
        width: 0,
        isLinkHandler: true
      }
      this.$emit('create-placeholder', holder)
      return holder
    }
  }
}
</script>

<style scoped>
.is-active:not(.in-select) {
  display: none;
}
.in-link:hover .is-active {
  display: block;
}
</style>
