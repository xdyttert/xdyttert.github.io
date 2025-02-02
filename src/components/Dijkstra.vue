<script setup lang="ts">
import type { Edges, Layouts, Nodes } from "v-network-graph";
import * as vNG from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { dijkstra, oneStepDijkstra } from "../algorithms/dijkstra";
import data from "../data/startingGraph";

const nodes: Nodes = inject("nodes")!
const edges: Edges = inject("edges")!

const graph = ref<vNG.Instance>()

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

const dijkstraStep = ref(0)

const layouts: Layouts = inject("layouts")!

function updateNodes(){
  for(const key in data.nodes){
    delete nodes[key]
    nodes[key] = data.nodes[key]
  }
}

function updateEdges(){
  for(const key in data.edges){
    delete edges[key]
    edges[key] = data.edges[key]
  }
}

function handleDijkstra(){
  dijkstra(data.nodes["node1"]);
  updateNodes();
}

function forwardStepDijkstra(){
  oneStepDijkstra(dijkstraStep.value, data.nodes["node1"]);
  updateNodes();
  updateEdges();
  dijkstraStep.value++;
}

function resetDijkstra(){
  dijkstraStep.value = 0
}

function print(){
  console.log(selectedNodes.value)
}
</script>

<template>
  <div>

    <div class="demo-control-panel">
    </div>

  <div class="section">
      <!-- DIJKSTRA SECTION-->
      <div class="row">
        <!-- <el-button @click="handleDijkstra">run dijkstra</el-button> -->
        <label class="label label-colored"> Dijkstra: </label>
        <el-button @click="forwardStepDijkstra">></el-button>
        <el-button @click="resetDijkstra">reset dijkstra</el-button>
      </div>
  </div>
  <div class="graph">
  <v-network-graph
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    ref="graph"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="data.configsDijkstra"
  >
  <template
      #override-node-label="{
        nodeId, scale, x, y, config, textAnchor, dominantBaseline
      }"
    >
    <text
        x="0"
        y="0"
        :font-size="9 * scale"
        text-anchor="middle"
        dominant-baseline="central"
        fill="#ffffff"
      >{{ nodes[nodeId].name }}</text>
      <text
        x="0"
        y="0"
        :font-size="config.fontSize * scale"
        :text-anchor="textAnchor"
        :dominant-baseline="dominantBaseline"
        :fill="config.color"
        :transform="`translate(${x} ${y})`"
      >{{ nodes[nodeId].distanceDijkstra }}</text>
    </template>

    <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.weight" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
  </v-network-graph>
  </div>
</div>
</template>
  
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "Dijkstra",
  });
</script>
    