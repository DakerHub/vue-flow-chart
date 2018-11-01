import { isInvert, isHorizontal, isVertical, isFront } from './vector'

/**
 * 根据两个点以及其方向，获取他们之间的位置关系
 * @param {PointWithVector} p1 点1
 * @param {PointWithVector} p2 点2
 */
export default function getDirectionRelationBetween(p1, p2) {
  const { vector: vectorP1 } = p1
  const { vector: vectorP2 } = p2
  if (isInvert(vectorP1, vectorP2)) {
    if (isHorizontal(vectorP1)) {
      // → ←
      return isFront(p1, p2, vectorP1)
        ? 'horizontal-invert-behind'
        : 'horizontal-invert-before'
    } else if (isVertical(vectorP1)) {
      return isFront(p1, p2, vectorP1)
        ? 'vertical-invert-behind'
        : 'vertical-invert-before'
    }
  }
}
