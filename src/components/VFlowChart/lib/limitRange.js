export default function limitRange (node, minX, minY, maxX, maxY) {
  const { width, height } = node
  let targetX = node.x
  let targetY = node.y
  if (targetX < minX) {
    targetX = minX
  }
  if (targetY < minY) {
    targetY = minY
  }
  if (targetX >= maxX - width) {
    targetX = maxX - width - 1
  }
  if (targetY >= maxY - height) {
    targetY = maxY - height - 1
  }
  return {
    x: targetX,
    y: targetY
  }
}