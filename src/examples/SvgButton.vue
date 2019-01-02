<template>
  <g class="svg-button">
    <rect
      :width="size.width+padding"
      :height="size.height+padding"
      :x="position.x"
      :y="position.y"/>
    <image
      :width="size.width"
      :height="size.height"
      :x="position.x+padding/2"
      :y="position.y+padding/2"
      cursor="pointer"
      :xlink:href="icon"
      @click="e => $emit('click', e)"/>
  </g>
</template>

<script>
export default {
  name: 'SvgButton',
  props: {
    icon: {
      type: String,
      default: ''
    },
    position: {
      type: Object,
      default: () => ({ x: 0, y: 0 })
    },
    size: {
      type: Object,
      default: () => ({ height: 20, width: 20 })
    },
    padding: {
      type: Number,
      default: 5
    }
  }
}
</script>

<style scoped>
.svg-button{
  fill: rgba(255,255,255,0.8);
}
.svg-button:hover{
  fill: rgba(255,255,255,0.5);
}
</style>
