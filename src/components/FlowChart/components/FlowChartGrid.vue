<template>
  <g>
    <rect
     v-for="(item, index) in blocks"
     :key="index"
     :width="unitX"
     :height="unitY"
     :x="item.col * unitX"
     :y="item.row * unitY"
     fill="#999">
    </rect>
    <rect
     v-for="(item, index) in path"
     :key="'path'+index"
     :width="unitX"
     :height="unitY"
     :x="item[0] * unitX"
     :y="item[1] * unitY"
     fill="#4CAF50">
    </rect>
    <line
      v-for="index in row"
      :key="'row'+index"
      x1="0"
      :y1="index * unitY"
      :x2="maxWidth"
      :y2="index * unitY"
      stroke="#ddd"
      stoke="1"></line>
    <line
      v-for="index in col"
      :key="'col'+index"
      :x1="index * unitX"
      y1="0"
      :x2="index * unitX"
      :y2="maxWidth"
      stroke="#ddd"
      stoke="1"></line>
  </g>
</template>

<script>
export default {
  name: 'FlowChartGrid',
  props: {
    row: {
      type: Number,
      default: 0
    },
    col: {
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
    },
    blocks: {
      type: Array,
      default: () => []
    },
    path: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    unitX() {
      if (this.col <= 0) return 0
      return this.maxWidth / this.col
    },
    unitY() {
      if (this.row <= 0) return 0
      return this.maxHeight / this.row
    }
  }
}
</script>
