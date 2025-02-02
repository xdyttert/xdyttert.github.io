<script setup lang="ts">
import type { Edges, Layouts, Nodes } from "v-network-graph";
import * as vNG from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { oneStepZwick, zwick } from "../algorithms/zwick";
import data from "../data/startingGraph";

const nodes: Nodes = inject("nodes")!
const edges: Edges = inject("edges")!

const graph = ref<vNG.Instance>()

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

const zwickStep = ref(0)
let zwickInnerCycle = true

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

function handleZwick(){
  console.log(data.nodes)
  zwick(data.nodes["node1"])
  updateNodes()
}

function forwardStepZwick(){
  zwickInnerCycle = oneStepZwick(zwickStep.value, data.nodes["node1"], zwickInnerCycle);
  updateNodes();
  updateEdges();
  zwickStep.value++;
}

function resetZwick(){
  zwickStep.value = 0
}
</script>

<template>
  <div>
    <div class="section">
    <!-- ZWICK SECTION-->
    <div class="row">
      <!-- <el-button @click="handleZwick">run zwick</el-button> -->
       <label class="label label-colored"> Zwick: </label>
      <el-button @click="forwardStepZwick">></el-button>
      <el-button @click="resetZwick">reset zwick</el-button>
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
    :configs="data.configsZwick"
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
      >{{ nodes[nodeId].distanceZwick }}</text>
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
    name: "Zwick",
  });
</script>