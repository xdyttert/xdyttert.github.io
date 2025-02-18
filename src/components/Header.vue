<script setup lang="ts">
import { type Edges, type Layouts, type Node, type Nodes } from "v-network-graph";
import { inject, provide, ref, type Ref } from "vue";
import { SortedLinkedList } from "../data/linkedList";
import data, { compareFunc } from "../data/startingGraph";
import { updateNodes, updateEdges } from "../utils/utils";

const nodes: Nodes = inject("nodes")!
const edges: Edges = inject("edges")!

const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextEdgeIndex = ref(Object.keys(edges).length + 1)

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

const layouts: Layouts = inject("layouts")!

const startingNodeName: Ref<string> = inject("startingNodeName")!

function addNode() {
  const nodeId = `node${nextNodeIndex.value}`
  const name = `N${nextNodeIndex.value}`
  nodes[nodeId] = { name, distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, 
                         solved: false, prev: null, 
                         colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", 
                         out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc) }
  layouts.nodes[nodeId] = {x: 360, y: -50}
  nextNodeIndex.value++
  console.log(data.layouts)
  updateNodes(nodes)
}

function removeNode() {
  let pastSelectedEdges = selectedEdges.value
  for (const key in selectedEdges.value){
    delete selectedEdges.value[key]
  }
  for (const nodeId of selectedNodes.value) {
    for (const key in edges){
      if (edges[key].source == nodeId){
        selectedEdges.value.push(key)
      }
      if (edges[key].target == nodeId){
        selectedEdges.value.push(key)
      }
    }
    removeEdge()
    // delete data.nodes[nodeId]
    delete nodes[nodeId]
  }
  selectedNodes.value = []
  selectedEdges.value = pastSelectedEdges
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value
  const edgeId = `edge${nextEdgeIndex.value}`
  const edge = { source, target, weight: 0, queueKey: 0, 
                 colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue" }
  // data.edges[edgeId] = edge
  edges[edgeId] = edge
  nodes[source].out.insertNode(edge)
  nodes[target].in.insertNode(edge)
  nextEdgeIndex.value++
}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    let edge = edges[edgeId]
    let source = nodes[edge.source]
    let target = nodes[edge.target]
    source.out.deleteNode(edge)
    target.in.deleteNode(edge)
    // delete data.edges[edgeId]
    delete edges[edgeId]
  }
}


function updateEdgeWeight(){
  for(const edgeId of selectedEdges.value){
    nodes[edges[edgeId].source].out.deleteNode(edges[edgeId])
    nodes[edges[edgeId].target].in.deleteNode(edges[edgeId])
    edges[edgeId].weight = +(document.getElementById("weightInput")! as HTMLInputElement).value;
    nodes[edges[edgeId].source].out.insertNode(edges[edgeId])
    nodes[edges[edgeId].target].in.insertNode(edges[edgeId])
  }
  updateEdges(edges);
}

</script>

<template>
<div class="header">
  <label class="label">Node: </label>
  <el-button @click="addNode">add</el-button>
  <el-button :disabled="selectedNodes.length == 0" @click="removeNode">remove</el-button>

  <label class="label">Edge: </label>
  <el-button :disabled="selectedNodes.length != 2" @click="addEdge">add</el-button>
  <el-button :disabled="selectedEdges.length == 0" @click="removeEdge">remove</el-button>

  <input class="text-input" type="integer" id="weightInput">
  <el-button @click="updateEdgeWeight">update edge weight</el-button>

  <label class="label">Starting node: </label>
  <el-select class="selection" 
             v-model="startingNodeName">
    <el-option v-for="node in nodes"
    :key="node.id"
    :label="node.name"
    :value="node.name"
    >
    </el-option>
  </el-select>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Header",
})
</script>
