<script setup lang="ts">
import { reactive, ref } from "vue"
import { type Nodes, type Edges, VNetworkGraph, type Node, type Edge } from "v-network-graph";
import * as vNG from "v-network-graph"
import data, { compareFunc, makeEdgesLists } from "./data/data"
import { isReadonlyKeywordOrPlusOrMinusToken } from "typescript";
import { ssrRenderDynamicAttr } from "vue/server-renderer";
import { dijkstra, oneStepDijkstra } from "./algorithms/dijkstra"
import { oneStepZwick, zwick } from "./algorithms/zwick"
import PriorityQueue from "ts-priority-queue";
import { SortedLinkedList } from "./data/linkedList";
import { oneStepSpira, spira } from "./algorithms/spira";


const nodes: Nodes = reactive({ ...data.nodes })
const edges: Edges = reactive({ ...data.edges })
const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextEdgeIndex = ref(Object.keys(edges).length + 1)

const graph = ref<vNG.Instance>()

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])

const dijkstraStep = ref(0)
const spiraStep = ref(0)
const zwickStep = ref(0)
let zwickInnerCycle = true

function addNode() {
  const nodeId = `node${nextNodeIndex.value}`
  const name = `N${nextNodeIndex.value}`
  data.nodes[nodeId] = { name, distance: 0, solved: false, prev: null, color: "blue", out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc) }
  nodes[nodeId] = { name, distance: 0, solved: false, prev: null, color: "blue", out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc) }
  nextNodeIndex.value++
  console.log(selectedNodes)
}

function removeNode() {
  let pastSelectedEdges = selectedEdges.value
  for (const key in selectedEdges.value){
    delete selectedEdges.value[key]
  }
  for (const nodeId of selectedNodes.value) {
    for (const key in data.edges){
      if (data.edges[key].source == nodeId){
        selectedEdges.value.push(key)
      }
      if (data.edges[key].target == nodeId){
        selectedEdges.value.push(key)
      }
    }
    removeEdge()
    delete data.nodes[nodeId]
    delete nodes[nodeId]
  }
  selectedNodes.value = []
  selectedEdges.value = pastSelectedEdges
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value
  const edgeId = `edge${nextEdgeIndex.value}`
  const edge = { source, target, weight: 0, queueKey: 0 }
  data.edges[edgeId] = edge
  edges[edgeId] = edge
  data.nodes[source].out.insertNode(edge)
  data.nodes[target].in.insertNode(edge)
  nextEdgeIndex.value++
}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    let edge = data.edges[edgeId]
    let source = data.nodes[edge.source]
    let target = data.nodes[edge.target]
    source.out.deleteNode(edge)
    target.in.deleteNode(edge)
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
    data.nodes[edges[edgeId].source].out.deleteNode(edges[edgeId])
    data.nodes[edges[edgeId].target].in.deleteNode(edges[edgeId])
    data.edges[edgeId].weight = +(document.getElementById("weightinput")! as HTMLInputElement).value;
    data.nodes[edges[edgeId].source].out.insertNode(edges[edgeId])
    data.nodes[edges[edgeId].target].in.insertNode(edges[edgeId])
  }
  updateEdges();
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

function handleSpira(){
  console.log(data.nodes)
  spira(data.nodes["node1"])
  updateNodes()
}

function forwardStepSpira(){
  oneStepSpira(spiraStep.value, data.nodes["node1"]);
  updateNodes();
  updateEdges();
  spiraStep.value++;
}

function resetSpira(){
  zwickStep.value = 0
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
<style scoped>
.button-container {
  display: flex;
  flex-direction: column; /* Stack rows vertically */
  gap: 10px; /* Add spacing between rows */
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
</style>

<template>
  <div class="demo-control-panel">
    <div class="row">
      <label class="label">Node: </label>
      <el-button @click="addNode">add</el-button>
      <el-button :disabled="selectedNodes.length == 0" @click="removeNode"
        >remove</el-button
      >
    </div>
    <div class="row">
      <label class="label">Edge: </label>
      <el-button :disabled="selectedNodes.length != 2" @click="addEdge"
        >add</el-button
      >
      <el-button :disabled="selectedEdges.length == 0" @click="removeEdge"
        >remove</el-button
      >
    </div>
    <div class="row">
        <input class="text-input" type="integer" id="weightinput">
        <el-button @click="updateEdgeWeight">update edge weight</el-button>
    </div>

    <!-- DIJKSTRA SECTION-->
    <div class="row">
      <!-- <el-button @click="handleDijkstra">run dijkstra</el-button> -->
      <label class="label"> Dijkstra: </label>
      <el-button @click="forwardStepDijkstra">></el-button>
      <el-button @click="resetDijkstra">reset dijkstra</el-button>
    </div>

    <!-- SPIRA SECTION-->
    <div class="row">
      <!-- <el-button @click="handleSpira">run spira</el-button> -->
       <label class="label"> Spira: </label>
      <el-button @click="forwardStepSpira">></el-button>
      <el-button @click="resetSpira">reset spira</el-button>
    </div>

    <!-- ZWICK SECTION-->
    <div class="row">
      <!-- <el-button @click="handleZwick">run zwick</el-button> -->
       <label class="label"> Zwick: </label>
      <el-button @click="forwardStepZwick">></el-button>
      <el-button @click="resetZwick">reset zwick</el-button>
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
      >{{ nodes[nodeId].distance }}</text>
    </template>

  <template #edge-label="{ edge, ...slotProps }">
      <v-edge-label :text="edge.weight" align="center" vertical-align="above" v-bind="slotProps" />
    </template>
  </v-network-graph>
</template>

