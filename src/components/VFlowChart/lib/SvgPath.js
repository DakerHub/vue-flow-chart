export default class SvgPath {
  paths = []
  startPoint = null
  endPoint = null
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.paths.push({
      type: 'M',
      x: startPoint.x,
      y: startPoint.y
    })
  }
  addPath(x, y) {
    this.paths.push({
      type: 'L',
      x,
      y
    })
    return { x, y }
  }
  /**
   * 从某点开始以向量方向增加一段路径
   * @param {Object} point 起始点
   * @param {Vector} vector 向量方向
   * @param {Number} length 增加的路径长度
   */
  addPathWithVectorFrom(point, vector, length) {
    const { x, y } = point
    const targetPoint = {
      x: x + vector.x * length,
      y: y + vector.y * length
    }
    this.addPath(targetPoint.x, targetPoint.y)
    return targetPoint
  }
  formatSvgPath() {
    return this.paths.map(i => `${i.type} ${i.x} ${i.y}`).join(' ')
  }
}
