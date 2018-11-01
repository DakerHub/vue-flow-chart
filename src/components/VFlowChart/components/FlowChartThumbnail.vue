<template>
  <div class="flow-chart-thumbnail">
    <div
      :style="boxStyle"
      class="flow-chart-thumbnail_box">
      <div
        class="flow-chart-thumbnail_view"
        :style="style">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlowChartThumbnail',
  props: {
    scale: {
      type: Number,
      default: 1
    },
    viewWidth: {
      type: Number,
      default: 640
    },
    viewHeight: {
      type: Number,
      default: 640
    },
    maxWidth: {
      type: Number,
      default: 1000
    },
    maxHeight: {
      type: Number,
      default: 1000
    },
    offsetX: {
      type: Number,
      default: 0
    },
    offsetY: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {
    boxStyle() {
      let width = 100
      let height = 100
      if (this.maxWidth > this.maxHeight) {
        height = (100 * this.maxHeight) / this.maxWidth
      } else {
        width = (100 * this.maxWidth) / this.maxHeight
      }
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    },
    style() {
      const { width, height } = this.boxStyle
      const boxWidth = Number.parseInt(width)
      const boxHeight = Number.parseInt(height)
      const thumbWidth = (boxWidth * this.viewWidth) / this.maxWidth
      const thumbHeight = (boxHeight * this.viewHeight) / this.maxHeight
      const thumbTop = (boxHeight * this.offsetY * this.scale) / this.maxHeight
      const thumbLeft = (boxWidth * this.offsetX * this.scale) / this.maxWidth
      return {
        width: `${thumbWidth * this.scale}px`,
        height: `${thumbHeight * this.scale}px`,
        top: `${thumbTop}px`,
        left: `${thumbLeft}px`
      }
    }
  }
}
</script>

<style scoped>
.flow-chart-thumbnail {
  width: 100px;
  height: 100px;
  border: thin solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
}
.flow-chart-thumbnail_box {
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
}
.flow-chart-thumbnail_view {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  outline: thin solid #FFEB3B;
}
</style>
