export function isParallel(v1, v2) {
  return v1.x * v2.y === v1.y * v2.x
}

export function isInvert(v1, v2) {
  return v1.x === -v2.x && v1.y === -v2.y
}

export function isHorizontal(vector) {
  return vector.y === 0 && vector.x !== 0
}

export function isVertical(vector) {
  return vector.x === 0 && vector.y !== 0
}

export function isSame(v1, v2) {
  return v1.x === v2.x && v1.y === v2.y
}

/**
 * 判断p1点以vector来判断是否在p2点之前
 * @param {Point} p1 点1
 * @param {Point} p2 点2
 * @param {Vector} vector 单位矢量
 */
export function isFront(p1, p2, vector) {
  return p1.x * vector.x + p1.y * vector.y > p2.x * vector.x + p2.y * vector.y
}

/**
 * 一某点为起点，获取某向量方向固定距离的点
 * @param {Point} p 起点
 * @param {Vector} vector 单位向量
 * @param {Number} length 距离
 */
export function getPointTo(p, vector, length) {
  const { x, y } = p
  return {
    x: x + vector.x * length,
    y: y + vector.y * length
  }
}
