<template>
  <g class="flow-chart-node">
    <defs>
      <filter id="f1" width="140%" height="140%" x="-20%" y="-20%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        <feOffset dx="0" dy="0" />
        <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.5 0   0   0   0
                    0   0.5 0   0   0
                    0   0   0.5 0   0
                    0   0   0   1   0" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect
      class="fcn-box"
      :data-id="node.id"
      :width="node.width"
      :height="node.height"
      rx="10"
      ry="10"
      :stroke="node.borderColor||'transparent'"
      stroke-width="2"
      stroke-linejoin="round"
      fill="rgba(255,255,255)"
      filter="url(#f1)" />
    <text
        class="fcn-text"
        pointer-events="none"
        x="100"
        y="36"
        text-anchor="middle"
      >{{node.text|textEllipsis(14, node.width - 20 )}}</text>
    <g
      class="fcn-btns"
      transform="translate(123, -30)"
      cursor="pointer"
      @mousedown.left.stop>
      <rect
        width="77"
        height="30"
        fill="transparent"/>
      <SvgButton icon="https://famaomao.oss-cn-shenzhen.aliyuncs.com/fff/public/static/svg/setting.svg"/>
      <SvgButton
        :position="{x:26,y:0}"
        icon="https://famaomao.oss-cn-shenzhen.aliyuncs.com/fff/public/static/svg/editting.svg"/>
      <SvgButton
        :position="{x:52,y:0}"
        icon="https://famaomao.oss-cn-shenzhen.aliyuncs.com/fff/public/static/svg/delete.svg"/>
    </g>
  </g>
</template>

<script>
import SvgButton from './SvgButton'

export default {
  name: 'FlowChartNode',
  components: {
    SvgButton
  },
  props: {
    node: {
      type: Object,
      default: () => ({})
    }
  },
  filters: {
    textEllipsis(text, fontSize, maxWidth) {
      if (!text) return ''
      const doubleCharMatcher = /[^x00-xff]/
      let formatText = text
      let totalWidth = 0
      const textArr = text.split('')

      for (let i = 0; i < textArr.length; i++) {
        if (totalWidth > maxWidth - 40) {
          formatText = text.substring(0, i) + '...'
          break
        }

        const char = textArr[i]

        if (doubleCharMatcher.test(char)) {
          totalWidth += fontSize
        } else {
          totalWidth += fontSize / 2
        }
      }

      return formatText
    }
  }
}
</script>

<style>
.fcn-btns{
  display: none;
  animation: fadeIn .3s;
}
.fcn-text{
  fill: #666;
  font: normal 18px sans-serif;
}
.flow-chart-node:hover .fcn-btns{
  display: unset;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
