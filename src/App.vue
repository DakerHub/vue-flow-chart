<template>
  <div id="app">
    <VFlowChart
      :width="640"
      :height="640"
      :show-grid="true"
      :user-router="true"></VFlowChart>
  </div>
</template>

<script>
import VFlowChart from './components/VFlowChart/Index'
export default {
  name: 'app',
  components: {
    VFlowChart
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
}
.svg-container{
  border: thin solid #ccc;
}
</style>
