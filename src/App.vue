<template>
  <div id="app">
    <VFlowChart
      :value="nodes"
      :width="640"
      :height="640"
      in-select-color="#FF9E1B"
      :high-light-radius="10"
      :show-grid="true"
      :path-width="5"
      path-color="#FF9E1B"
      :use-router="true">
      <template slot-scope="{node}" slot="content">
        <FlowChartNode :node="node"></FlowChartNode>
      </template>
    </VFlowChart>
  </div>
</template>

<script>
import VFlowChart from './components/VFlowChart/Index'
import FlowChartNode from './examples/FlowChartNode'

export default {
  name: 'app',
  components: {
    VFlowChart,
    FlowChartNode
  },
  data () {
    return {
      nodes: []
    }
  },
  created () {
    setTimeout(() => {
      this.nodes = [
        {
          prevId: '',
          id: '1',
          x: 200,
          y: 400,
          width: 200,
          height: 60,
          text: 'node1沙发沙发'
        },
        {
          prevId: '',
          id: '2',
          x: 200,
          y: 400,
          width: 200,
          height: 60,
          text: 'node1沙发沙发'
        }
      ]
    }, 1000)
  }
}
</script>

<style>
#app {
  display: flex;
  justify-content: center;
  width: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.flow-chart{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 700px;
  width: 700px;
  border: thin solid #ccc;
  background-color: #fafafa;
}
.svg-container{
  border: thin solid #ccc;
}
</style>
