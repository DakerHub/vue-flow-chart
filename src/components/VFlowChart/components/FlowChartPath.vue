<template>
  <g>
    <path
      :d="svgPath"
      :stroke="inSelect?'#FFEB3B':pathColor"
      :stroke-width="inSelect?6:3"
      stroke-linejoin="round"
      fill="none"
      cursor="pointer"></path>
  </g>
</template>

<script>
import getSvgPath from './../lib/getSvgPath.js'
import SvgPath from './../lib/SvgPath.js'
import PF from 'pathfinding'
console.log(PF)

export default {
  name: 'FlowChartPath',
  props: {
    path: {
      type: Object,
      default: () => {}
    },
    pathColor: {
      type: String,
      default: '#b39ddb'
    },
    currentPathId: {
      type: String,
      default: ''
    },
    grid: {
      type: Object,
      default: () => ({})
    },
    unitX: {
      type: Number,
      default: 0
    },
    unitY: {
      type: Number,
      default: 0
    },
    row: {
      type: Number,
      default: 0
    },
    col: {
      type: Number,
      default: 0
    },
    useRouter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPath: null,
      // finder: new PF.AStarFinder({ weight: 2, allowDiagonal: false }),
      finder: new PF.JumpPointFinder({
        diagonalMovement: 2
      }),
      svgPath: ''
    }
  },
  computed: {
    inSelect() {
      return this.currentPathId === this.path.id
    }
  },
  watch: {
    path: {
      immediate: true,
      deep: true,
      handler(path) {
        this.currentPath = path
        if (!path) {
          this.svgPath = ''
        } else {
          this.svgPath = this.useRouter
            ? this.getAStartSvgPath(path.start, path.end) ||
              getSvgPath(path.start, path.end)
            : getSvgPath(path.start, path.end)
        }
      }
    }
  },
  methods: {
    getAStartSvgPath(start, end) {
      const startRow = Math.floor(start.y / this.unitY)
      const startExtendRow = startRow + 1 > this.row ? startRow : startRow + 1
      const startCol = Math.floor(start.x / this.unitX)
      const endRow = Math.floor(end.y / this.unitY) - 1
      const endExtendRow = endRow - 1 < 0 ? 0 : endRow - 1
      const endCol = Math.floor(end.x / this.unitX)
      if (
        this.grid.isBlock(startExtendRow, startCol) ||
        this.grid.isBlock(endExtendRow, endCol)
      ) {
        return ''
      }

      const matrix = this.grid.getGrid()
      const pfGrid = new PF.Grid(matrix)
      const path = this.finder.findPath(
        startCol,
        startExtendRow,
        endCol,
        endExtendRow,
        pfGrid
      )
      const compressPath = PF.Util.compressPath(path)

      if (!compressPath.length) {
        return ''
      }

      this.$emit('update-path', path)

      const firstPathPoint = compressPath[0]
      const svgPath = new SvgPath(
        {
          x: (firstPathPoint[0] + 0.5) * this.unitX,
          y: start.y
        },
        end
      )
      compressPath.forEach(c => {
        svgPath.addPath((c[0] + 0.5) * this.unitX, (c[1] + 0.5) * this.unitY)
      })
      const lastPathPoint = compressPath[compressPath.length - 1]

      svgPath.addPath((lastPathPoint[0] + 0.5) * this.unitX, end.y)
      return svgPath.formatSvgPath()
    }
  }
}
</script>

<style scoped>
</style>
