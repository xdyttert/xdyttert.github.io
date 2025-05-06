<script setup lang="ts">
import type { Layouts, VNetworkGraphInstance } from "v-network-graph";
import { defineComponent, provide, reactive, ref, type Ref } from "vue";
import Dijkstra from "./components/Dijkstra.vue";
import Header from "./components/Header.vue";
import Spira from "./components/Spira.vue";
import Zwick from "./components/Zwick.vue";
import data, { makeEdgesLists } from "./data/startingGraph";
import { tr } from "element-plus/es/locales.mjs";
import { type Node, type Edge, type Nodes, type Edges } from "./data/startingGraph";

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])

provide("selectedNodesProv", selectedNodes)
provide("selectedEdgesProv", selectedEdges)

const nodes = reactive({ ...data.nodes })
const edges = reactive({ ...data.edges })
const graph = ref<VNetworkGraphInstance | null>(null);

provide("nodes", nodes)
provide("edges", edges)
provide("graph", graph)

const layouts = reactive({ ...data.layouts })

provide("layouts", layouts)

const startingNodeName: Ref<string> = ref("N1")

provide("startingNodeName", startingNodeName)

const show = reactive({
    dijkstra: true,
    spira: true,
    zwick: true
})
provide("show", show)

makeEdgesLists(nodes, edges)

</script>

<template> 
  <div id="app">
    <Header class="app-header" />
    <div class="container">
      <Dijkstra class="section" v-if="show.dijkstra"/>
      <Spira class="section" v-if="show.spira"/>
      <Zwick class="section" v-if="show.zwick"/>
    </div>
    <div class="status-message-container">
      <div class="status-message">
        <span class="info-icon">ℹ️</span>
        <span>When selecting aditional node or edge hold Shift.</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  name: "App",
  components: {
    Dijkstra,
    Spira,
    Zwick,
    Header,
  },

});
</script>

<style>
.container {
  display: flex;
  width: 100%;
  height: 100%;
  
}
@media (max-width: 1500px) { 
  .container {
    flex-direction: column;
    overflow-y: auto;
    position: relative;
  }
}
.section {
  flex: 1;
  border: 1px solid #000000;
  min-width: 0;
}
.row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.label {
  text-align: center;
  color: #000000;
}
.graph {
  flex: 1;
  display: flex;
  float: center;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 0rem;
  border-radius: 1px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  height: 100%;
}
.el-button {
  color: #000000;
  font-weight: bold;
  border: 0.5px solid #000000;
  position: relative;
  margin-left: 1px;
}
.el-button:disabled {
  opacity: 1;
  font-weight: bold;
  border: 0.5px solid #000000;
}
.toggles {
  display: flex;
  gap: 10px;
  align-items: center;
}
.toggle {
  width: 20px;
  height: 20px;
  border: 1px solid #000000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  border-radius: 5px;
  user-select: none;
}
.status-message-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 20%;
  z-index: 1000; /* Ensure it's above other elements */
}
.app-header {
  flex: 1;
  border: 2px solid #000000;
  border-bottom: 2px solid #000000;
  min-width: 0;
  min-height: 50px; /* Add a minimum height */
  display: block; /* Ensure it's displayed as a block element */
  width: 100%; /* Make it take full width */
}
.status-message {
  padding: 5px;
  background-color: #f9f9f9;
  border-top: 1px solid #eee;
  font-size: 14px;
  color: #606266;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 -1px 2px rgba(0,0,0,0.1); /* Add subtle shadow to make it stand out */
}

.info-icon {
  color: #409EFF;
}
</style>