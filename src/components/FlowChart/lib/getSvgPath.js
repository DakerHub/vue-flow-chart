import { getPointTo } from './vector'
import SvgPath from './SvgPath'
import getDirectionRelationBetween from './getDirectionRelationBetween'

/**
 * 获取两个坐标点之间的正交svg path
 * @param {object} startPoint 起始点
 * @param {object} endPoint 终止点
 */
export default function getSvgPath(startPoint, endPoint) {
  const extendLength = 10
  const { x: startX, y: startY, vector: startVector } = startPoint
  const { x: endX, y: endY, vector: endVector } = endPoint
  const svgPath = new SvgPath(startPoint, endPoint)
  const midPoint = {
    x: (startX + endX) / 2,
    y: (startY + endY) / 2
  }
  const startEntendPoint = svgPath.addPathWithVectorFrom(
    startPoint,
    startVector,
    extendLength
  )
  const relation = getDirectionRelationBetween(startPoint, endPoint)
  if (relation === 'horizontal-invert-behind') {
    svgPath.addPath(midPoint.x, startPoint.y)
    svgPath.addPath(midPoint.x, endPoint.y)
  }
  if (relation === 'horizontal-invert-before') {
    svgPath.addPath(midPoint.x, startPoint.y)
    svgPath.addPath(midPoint.x, endPoint.y)
  }
  if (relation === 'vertical-invert-behind') {
    const endExtendPoint = getPointTo(endPoint, endVector, extendLength)

    svgPath.addPath(midPoint.x, startEntendPoint.y)
    svgPath.addPath(midPoint.x, endExtendPoint.y)
  }
  if (relation === 'vertical-invert-before') {
    svgPath.addPath(startPoint.x, midPoint.y)
    svgPath.addPath(endPoint.x, midPoint.y)
  }

  svgPath.addPathWithVectorFrom(endPoint, endVector, extendLength)
  svgPath.addPath(endX, endY)

  return svgPath.formatSvgPath()
}
