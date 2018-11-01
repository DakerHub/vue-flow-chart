export default function(nodes) {
  const pointMap = {}
  const pathPoints = []
  nodes.forEach(node => {
    pointMap[node.id] = {
      entry: {
        x: node.x + node.width / 2,
        y: node.y,
        vector: {
          x: 0,
          y: -1
        }
      },
      output: {
        x: node.x + node.width / 2,
        y: node.y + node.height,
        vector: {
          x: 0,
          y: 1
        }
      }
    }
  })
  nodes.forEach(node => {
    if (node.prevId) {
      pathPoints.push({
        start: pointMap[node.prevId].output,
        end: pointMap[node.id].entry,
        prevId: node.prevId,
        id: node.id
      })
    }
  })
  return pathPoints
}
