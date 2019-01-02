<template>
  <div class="flow-chart">
    <svg
      class="svg-container"
      :width="width"
      :height="height"
      :viewBox="`${svgOffsetX * scale} ${svgOffsetY * scale} ${width * scale} ${height * scale}`"
      :cursor="inGrab?'grabbing':'grab'"
      @mousedown.stop="handleMouseDown"
      @mousewheel="handleMousewheel"
      @click.left="handleContainerClick"
    >
      <FlowChartGrid
        v-if="showGrid"
        :row="row"
        :col="col"
        :maxWidth="maxWidth"
        :maxHeight="maxHeight"
        :blocks="blocks"
        :path="path"
      ></FlowChartGrid>

      <FlowChartPath
        class="flow-chart-path"
        v-for="(item,index) in paths"
        :key="index"
        :path="item"
        :scale="scale"
        :path-color="pathColor"
        :path-color-select="pathColorSelect"
        :path-width="pathWidth"
        :current-path-id="currentPathId"
        :grid="grid"
        :row="row"
        :col="col"
        :unit-x="unitX"
        :unit-y="unitY"
        :use-router="useRouter"
        @update-path="handleUpdatePath"
        @click.native.stop="handleClickPath(item)"
      ></FlowChartPath>

      <FlowChartNode
        class="flow-chart-node"
        v-for="(item,index) in nodes"
        :key="'rect'+index"
        :node="item"
        :in-link="inLink"
        :scale="scale"
        :view-offse-x="svgOffsetX"
        :view-offse-y="svgOffsetY"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :is-link-handler="item.isLinkHandler"
        :high-light-radius="highLightRadius"
        :in-link-color="inLinkColor"
        :in-select-color="inSelectColor"
        :indicator-color="indicatorColor"
        :current-node-id="currentNodeId"
        @create-placeholder="createPlaceholder"
        @remove-node="removeNode"
        @link-node="linkNode"
        @in-link-change="val => inLink = val"
        @click.native.stop="handleClickNode(item)"
        @node-change="nodeChange"
      >
        <slot :node="item" name="content" pointer-events="none"></slot>
      </FlowChartNode>
    </svg>

    <div class="flow-chart-tools">
      <FlowChartThumbnail
        class="flow-chart-tool"
        v-if="tools.includes('thumbnail')"
        :scale="scale"
        :max-width="maxWidth"
        :max-height="maxHeight"
        :view-width="width"
        :view-height="height"
        :offset-x="svgOffsetX"
        :offset-y="svgOffsetY"
      ></FlowChartThumbnail>

      <button
        v-if="tools.includes('resetScale')"
        class="flow-chart-tool flow-chart-reset-scale"
        @click="handleResetScale"
      >重置缩放</button>

      <div
        v-if="tools.includes('mousePosition')"
        class="flow-chart-tool flow-chart-mouse-position"
      >x: {{ currentMousePostion.x }}，y: {{ currentMousePostion.y }}</div>
    </div>
  </div>
</template>

<script>
import FlowChartNode from "./components/FlowChartNode";
import FlowChartPath from "./components/FlowChartPath";
import FlowChartThumbnail from "./components/FlowChartThumbnail";
import FlowChartGrid from "./components//FlowChartGrid";
import getPathPoints from "./lib/getPathPoints.js";
import Grid from "./lib/Grid.js";
import limitRange from "./lib/limitRange.js";
import clonedeep from "lodash.clonedeep";
import isequal from "lodash.isequal";

export default {
  name: "VFlowChart",
  props: {
    value: {
      type: Array,
      default: () => []
    },
    pathColor: {
      type: String,
      default: "#b39ddb"
    },
    pathColorSelect: {
      type: String,
      default: "#ffeb3b"
    },
    pathWidth: {
      type: Number,
      default: 4
    },
    width: {
      type: Number,
      default: 640
    },
    height: {
      type: Number,
      default: 640
    },
    maxWidth: {
      type: Number,
      default: 1000
    },
    maxHeight: {
      type: Number,
      default: 1000
    },
    row: {
      type: Number,
      default: 50
    },
    col: {
      type: Number,
      default: 50
    },
    showGrid: {
      type: Boolean,
      default: false
    },
    useRouter: {
      type: Boolean,
      default: false
    },
    tools: {
      type: Array,
      default: () => ["thumbnail", "resetScale", "mousePosition"]
    },
    highLightRadius: {
      type: Number,
      default: 8
    },
    inLinkColor: {
      type: String,
      default: "#ccc"
    },
    inSelectColor: {
      type: String,
      default: "#ffeb3b"
    },
    indicatorColor: {
      type: String,
      default: "#2196f3"
    }
  },
  components: {
    FlowChartNode,
    FlowChartPath,
    FlowChartThumbnail,
    FlowChartGrid
  },
  data() {
    return {
      nodes: [],
      scale: 1,
      svgOffsetX: 0,
      svgOffsetY: 0,
      inGrab: false,
      inLink: false,
      $svgContainer: null,
      currentPathId: "",
      currentNodeId: "",
      blocks: [],
      grid: null,
      unitX: this.maxWidth / this.col,
      unitY: this.maxHeight / this.row,
      path: [],
      currentMouseX: 0,
      currentMouseY: 0
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (isequal(val, this.nodes)) return;

        const nodes = clonedeep(val);
        nodes.forEach(node => {
          const nodePositionLimited = limitRange(
            node,
            0,
            0,
            this.maxWidth,
            this.maxHeight
          );
          Object.assign(node, nodePositionLimited);
        });

        if (this.grid) {
          this.resetBlocks(nodes);
        }

        this.nodes = nodes;
      }
    }
  },
  computed: {
    paths() {
      return getPathPoints(this.nodes);
    },
    currentMousePostion() {
      return {
        x: ((this.currentMouseX + this.svgOffsetX) * this.scale).toFixed(0),
        y: ((this.currentMouseY + this.svgOffsetY) * this.scale).toFixed(0)
      };
    }
  },
  created() {
    this.grid = new Grid(this.row, this.col, this.maxWidth, this.maxHeight);
    this.resetBlocks(this.nodes);
  },
  mounted() {
    this.$svgContainer = this.$el.querySelector(".svg-container");

    const recodeMouse = e => {
      this.currentMouseX = e.offsetX;
      this.currentMouseY = e.offsetY;
    };

    this.$svgContainer.addEventListener("mousemove", recodeMouse);

    this.$once("hook:beforeDestroy", function() {
      this.$svgContainer.removeEventListener("mousemove", recodeMouse);
    });

    this.bindHotKey();
  },
  methods: {
    createPlaceholder(placeholder) {
      this.nodes.push(placeholder);
    },
    removeNode(nodeId) {
      const idx = this.nodes.findIndex(i => i.id === nodeId);
      if (idx !== -1) {
        this.nodes.splice(idx, 1);
      }
    },
    bindHotKey() {
      const bindKey = e => {
        if (e.key === "Delete") {
          if (this.currentPathId) {
            return this.deleteCurrentPath();
          }
          if (this.currentNodeId) {
            return this.deleteCurrentNode();
          }
        }
        if (this.currentNodeId) {
          const node = this.nodes.find(n => n.id === this.currentNodeId);
          if (node && e.key === "ArrowLeft" && node.x > 0) {
            node.x--;
          }
          if (
            node &&
            e.key === "ArrowRight" &&
            node.x < this.maxWidth - node.width - 1
          ) {
            node.x++;
          }
          if (node && e.key === "ArrowUp" && node.y > 0) {
            node.y--;
          }
          if (
            node &&
            e.key === "ArrowDown" &&
            node.y < this.maxHeight - node.height - 1
          ) {
            node.y++;
          }
          this.nodeChange(node);
        }
      };
      document.addEventListener("keyup", bindKey);

      this.$once("hook:beforeDestroy", function() {
        this.$svgContainer.removeEventListener("mousemove", bindKey);
      });
    },
    deleteCurrentPath() {
      const currentPath = this.paths.find(p => p.id === this.currentPathId);
      if (!currentPath) return;

      const prevId = currentPath.prevId;
      this.$emit("delete-path", this.currentPathId, prevId);
    },
    deleteCurrentNode() {
      this.$emit("delete-node", this.currentNodeId);
    },
    linkNode(targetNodeId, currentNodeId) {
      const targetNode = this.nodes.find(r => r.id === targetNodeId);
      if (targetNode) {
        this.$set(targetNode, "prevId", currentNodeId);
      }

      this.$emit("node-link", targetNodeId, currentNodeId);
    },
    nodeChange(node) {
      const idx = this.nodes.findIndex(n => n.id === node.id);
      this.nodes.splice(idx, 1, clonedeep(node));
      this.resetBlocks(this.nodes);
      this.$emit("node-change", node);
    },
    resetBlocks(nodes) {
      this.grid.clearBlocks();
      this.blocks = this.grid.addBlocks(nodes);
    },
    handleMousewheel(e) {
      if (this.scale <= 0.5 && e.wheelDeltaY > 0) return;
      if (this.scale >= 2 && e.wheelDeltaY < 0) return;
      const deltaS = e.wheelDeltaY / 1200;
      const targetS = this.scale - deltaS;

      const maxScaleX = this.maxWidth / this.width;
      const maxScaleY = this.maxHeight / this.height;

      const minScale = Math.min(maxScaleX, maxScaleY);

      let finalS = targetS > minScale ? minScale : targetS;
      finalS = finalS < 0.5 ? 0.5 : finalS;
      this.scale = finalS;

      // 防止放大的时候溢出
      if ((this.svgOffsetX + this.width) * finalS > this.maxWidth) {
        this.svgOffsetX = this.maxWidth / finalS - this.width;
      }
      if ((this.svgOffsetY + this.height) * finalS > this.maxHeight) {
        this.svgOffsetY = this.maxHeight / finalS - this.height;
      }
    },
    handleMouseDown(e) {
      this.inGrab = true;
      const { offsetX: oriOffsetX, offsetY: oriOffsetY } = e;
      const oriSvgOffsetX = this.svgOffsetX;
      const oriSvgOffsetY = this.svgOffsetY;

      const $svgContainer = this.$svgContainer;

      const handleMouseMove = e => {
        const { offsetX, offsetY } = e;

        let targetX = oriSvgOffsetX + oriOffsetX - offsetX;
        let targetY = oriSvgOffsetY + oriOffsetY - offsetY;

        const positionLimited = limitRange(
          {
            x: targetX,
            y: targetY,
            width: this.width,
            height: this.height
          },
          0,
          0,
          this.maxWidth / this.scale,
          this.maxHeight / this.scale
        );

        this.svgOffsetX = positionLimited.x;
        this.svgOffsetY = positionLimited.y;
      };

      const handleMoveEnd = () => {
        this.inGrab = false;
        $svgContainer.removeEventListener("mousemove", handleMouseMove);
        $svgContainer.removeEventListener("mouseup", handleMoveEnd);
        $svgContainer.removeEventListener("mouseleave", handleMoveEnd);
      };

      $svgContainer.addEventListener("mousemove", handleMouseMove);
      $svgContainer.addEventListener("mouseup", handleMoveEnd);
      $svgContainer.addEventListener("mouseleave", handleMoveEnd);
    },
    handleClickPath(item) {
      this.currentPathId = item.id;
    },
    handleClickNode(item) {
      this.currentNodeId = item.id;
      this.currentPathId = "";
      this.$emit("current-node-change", item.id);
    },
    handleContainerClick() {
      this.currentPathId = "";
      this.currentNodeId = "";
    },
    handleResetScale() {
      this.scale = 1;
      this.svgOffsetX = 0;
      this.svgOffsetY = 0;
    },
    handleUpdatePath() {}
  }
};
</script>

<style scoped>
.flow-chart {
  position: relative;
}
.flow-chart-tools {
  position: absolute;
  right: 10px;
  top: 10px;
  text-align: right;
}
.flow-chart-tool {
  margin-bottom: 10px;
}

.flow-chart-reset-scale {
  border: thin solid #ccc;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  outline: none;
  transition: all 0.3s;
}
.flow-chart-reset-scale:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
.flow-chart-reset-scale:active {
  background-color: rgba(0, 0, 0, 0.2);
}
.flow-chart-mouse-position {
  font-size: 12px;
}
</style>
