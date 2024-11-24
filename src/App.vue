<script setup lang="ts">
import { reactive, ref } from "vue"
import { type Nodes, type Edges, VNetworkGraph, type Node, type Edge } from "v-network-graph";
import * as vNG from "v-network-graph"
import data, { compareFunc, makeEdgesLists } from "./data/data"
import { isReadonlyKeywordOrPlusOrMinusToken } from "typescript";
import { ssrRenderDynamicAttr } from "vue/server-renderer";
import { dijkstra, oneStepDijkstra } from "./algorithms/dijkstra"
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

function addNode() {
  const nodeId = `node${nextNodeIndex.value}`
  const name = `N${nextNodeIndex.value}`
  data.nodes[nodeId] = { name, distance: 0, solved: false, prev: null, color: "blue", out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc) }
  nodes[nodeId] = { name, distance: 0, solved: false, prev: null, color: "blue", out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc) }
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
  const edge = { source, target, weight: 0, queueKey: 0 }
  data.edges[edgeId] = edge
  edges[edgeId] = edge
  data.nodes[source].out.insertNode(edge)
  data.nodes[target].in.insertNode(edge)
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
  spiraStep.value = 0
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
    <div>
      <el-button @click="forwardStepDijkstra">></el-button>
    </div>
    <div>
    <el-button @click="resetDijkstra">reset dijkstra</el-button>
    </div>
    <div>
      <el-button @click="handleSpira">run spira</el-button>
    </div>
    <div>
      <el-button @click="forwardStepSpira">></el-button>
    </div>
    <div>
    <el-button @click="resetSpira">reset spira</el-button>
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


