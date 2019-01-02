export default class Grid {
  grid = []
  row = 0
  col = 0
  maxWidth = 0
  maxHeight = 0
  unitX = 0
  unitY = 0
  blocksPosition = []
  constructor(row, col, maxWidth, maxHeight) {
    this.row = row
    this.col = col
    this.maxWidth = maxWidth
    this.maxHeight = maxHeight
    this.unitX = maxWidth / col
    this.unitY = maxHeight / row
    this.initGrid()
  }
  initGrid() {
    this.grid = new Array(this.row).fill(0)
    this.grid.forEach((row, i, arr) => {
      arr[i] = new Array(this.col).fill(0)
    })
  }
  getGrid() {
    return this.grid
  }
  clearBlocks() {
    this.blocksPosition = []
    this.initGrid()
  }
  addBlocks(blocks) {
    blocks.forEach(block => {
      const { x, y, width, height } = block
      const ltPosition = this.getPositionOf({
        x,
        y
      })
      const lbPosition = this.getPositionOf({
        x,
        y: y + height
      })
      const rtPosition = this.getPositionOf({
        x: x + width,
        y
      })
      const rbPosition = this.getPositionOf({
        x: x + width,
        y: y + height
      })
      const blockCorner = [
        ltPosition,
        rtPosition,
        rbPosition,
        lbPosition,
        ltPosition
      ]
      blockCorner.reduce((p1, p2) => {
        if (p1.col !== p2.col) {
          let minCol = p1.col
          let maxCol = p2.col
          if (minCol > maxCol) {
            minCol = p2.col
            maxCol = p1.col
          }
          for (let i = 0; i < maxCol - minCol; i++) {
            const row = p1.row
            const col = minCol + i
            if (row < this.row && col < this.col) {
              this.blocksPosition.push({ row, col })
              this.grid[row][col] = 1
            }
          }
        }
        if (p1.row !== p2.row) {
          let minRow = p1.row
          let maxRow = p2.row
          if (minRow > maxRow) {
            minRow = p2.row
            maxRow = p1.row
          }
          for (let i = 0; i < maxRow - minRow + 1; i++) {
            const row = minRow + i
            const col = p1.col
            if (row < this.row && col < this.col) {
              this.blocksPosition.push({ row, col })
              this.grid[row][col] = 1
            }
          }
        }
        return p2
      })
    })
    return this.blocksPosition
  }
  isBlock(row, col) {
    if (this.grid.length > row && this.grid[row].length > col) {
      return this.grid[row][col] === 1
    }
    return true
  }
  getPositionOf(point) {
    return {
      row: Math.floor(point.y / this.unitY),
      col: Math.floor(point.x / this.unitX)
    }
  }
}
