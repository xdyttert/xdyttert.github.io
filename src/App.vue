<script setup lang="ts">
import type { Layouts } from "v-network-graph";
import { defineComponent, provide, reactive, ref, type Ref } from "vue";
import Dijkstra from "./components/Dijkstra.vue";
import Header from "./components/Header.vue";
import Spira from "./components/Spira.vue";
import Zwick from "./components/Zwick.vue";
import data from "./data/startingGraph";
import { tr } from "element-plus/es/locales.mjs";

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])

provide("selectedNodesProv", selectedNodes)
provide("selectedEdgesProv", selectedEdges)

const nodes = reactive({ ...data.nodes })
const edges = reactive({ ...data.edges })

provide("nodes", nodes)
provide("edges", edges)

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

</script>

<template> 
  <div id="app">
    <Header />
    <div class="container">
      <Dijkstra class="section" v-if="show.dijkstra"/> 
      <Spira class="section" v-if="show.spira"/>
      <Zwick class="section" v-if="show.zwick"/>
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
/* Global Grid Layout for Three Columns */
.container {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Optional: Styling for each section */
.section {
  flex: 1;
  border: 1px solid #000000;
  min-width: 0;
}
.row {
  display: flex; /* Use flexbox for row alignment */
  align-items: center; /* Vertically center label and button */
  gap: 10px; /* Space between label and button */
}
.label {
  min-width: 55px; /* Set consistent label width */
  text-align: center; /* Right-align label text */
  color: #000000;
}
.graph {
  flex: 1; /* Allow the graph to expand and fill available space */
  display: flex;
  float: center;
  justify-content: center; /* Center the graph horizontally */
  align-items: center; /* Center the graph vertically */
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
}
.el-button:disabled {
  opacity: 1;
  font-weight: bold;
  border: 0.5px solid #000000;
}
.toggles {
  display: flex;
  gap: 10px;
  align-items: center; /* Align toggle buttons with labels */
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
</style>