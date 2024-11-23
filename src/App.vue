<script setup lang="ts">
import { reactive, ref } from "vue"
import { type Nodes, type Edges, VNetworkGraph } from "v-network-graph";
import * as vNG from "v-network-graph"
import data from "./data/data"
import { isReadonlyKeywordOrPlusOrMinusToken } from "typescript";
import { ssrRenderDynamicAttr } from "vue/server-renderer";
import { dijkstra } from "./algorithms/dijkstra"


const nodes: Nodes = reactive({ ...data.nodes })
const edges: Edges = reactive({ ...data.edges })
const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextEdgeIndex = ref(Object.keys(edges).length + 1)

const graph = ref<vNG.Instance>()

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])

// const eventHandlers: EventHandlers = {
//   "edge:click": 
// }

function addNode() {
  const nodeId = `node${nextNodeIndex.value}`
  const name = `N${nextNodeIndex.value}`
  data.nodes[nodeId] = { name, distance: 0, solved: false, prev: null }
  nodes[nodeId] = { name, distance: 0, solved: false, prev: null }
  nextNodeIndex.value++
}

function removeNode() {
  for (const nodeId of selectedNodes.value) {
    delete data.nodes[nodeId]
    delete nodes[nodeId]
  }
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value
  const edgeId = `edge${nextEdgeIndex.value}`
  data.edges[edgeId] = { source, target, weight: 0 }
  edges[edgeId] = { source, target, weight: 0 }
  nextEdgeIndex.value++
}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    delete data.edges[edgeId]
    delete edges[edgeId]
  }
}

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

function updateEdgeWeight(){
  for(const edgeId of selectedEdges.value){
    data.edges[edgeId].weight = +(document.getElementById("weightinput")! as HTMLInputElement).value;
    console.log((document.getElementById("weightinput")! as HTMLInputElement).value)
  }
  updateEdges();
}



</script>

<template>
  <div class="demo-control-panel">
    <div>
      <label>Node:</label>
      <el-button @click="addNode">add</el-button>
      <el-button :disabled="selectedNodes.length == 0" @click="removeNode"
        >remove</el-button
      >
    </div>
    <div>
      <label>Edge:</label>
      <el-button :disabled="selectedNodes.length != 2" @click="addEdge"
        >add</el-button
      >
      <el-button :disabled="selectedEdges.length == 0" @click="removeEdge"
        >remove</el-button
      >
    </div>
    <div>
      <input type="integer" id="weightinput">
        <el-button @click="updateEdgeWeight">update edge weight</el-button>
    </div>
    <div>
      <el-button @click="handleDijkstra">run dijkstra</el-button>
    </div>
  </div>

  <v-network-graph
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    ref="graph"
    :nodes="nodes"
    :edges="edges"
    :layouts="data.layouts"
    :configs="data.configs"
  >
  <template
      #override-node-label="{
        nodeId, scale, x, y, config, textAnchor, dominantBaseline
      }"
    >
      <text
        x="0"
        y="0"
        :font-size="config.fontSize * scale"
        :text-anchor="textAnchor"
        :dominant-baseline="dominantBaseline"
        :fill="config.color"
        :transform="`translate(${x} ${y})`"
      >{{ nodes[nodeId].distance }}</text>
    </template>

  <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.weight" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
  </v-network-graph>
</template>


