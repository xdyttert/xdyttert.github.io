<script setup lang="ts">
import { defineComponent, ref, type Ref } from "vue";
import Dijkstra from "./components/Dijkstra.vue";
import Spira from "./components/Spira.vue";
import Zwick from "./components/Zwick.vue";
import Header from "./components/Header.vue";
import { provide, reactive } from "vue";
import data, { compareFunc } from "./data/startingGraph";

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])

provide("selectedNodesProv", selectedNodes)
provide("selectedEdgesProv", selectedEdges)

const nodes = reactive({ ...data.nodes })
const edges = reactive({ ...data.edges })

provide("nodes", nodes)
provide("edges", edges)

const layouts = reactive({...data.layouts})

provide("layouts", layouts)

</script>

<template> 
  
  <div id="app">
    <Header />
    <div class="container">
      <Dijkstra class="section"/> 
      <Spira class="section"/>
      <Zwick class="section"/>
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* Each column takes up equal space */
  gap: 1rem; /* Spacing between columns */
  height: 100vh; /* Full-height layout */
  padding: 1rem;
  box-sizing: border-box;
}

/* Optional: Styling for each section */
.section {
  background-color: #888686;
  padding: 0rem;
  border-radius: 1px;
  box-shadow: 0 1px 1px rgba(40, 39, 39, 0.1);
}
.text-input{
    max-width: 50px;
  }
  .row {
    display: flex; /* Use flexbox for row alignment */
    align-items: center; /* Vertically center label and button */
    gap: 10px; /* Space between label and button */
  }
  .label {
    min-width: 55px; /* Set consistent label width */
    text-align: center; /* Right-align label text */
  }
  .label-colored{
    color: #1e00ff;
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
.header {
  width: 100%;
  background-color: #007bff;
  color: white;
  text-align: center;
  padding: 0rem;
  font-size: 1.5rem;
  font-weight: bold;
  align-content: center;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>