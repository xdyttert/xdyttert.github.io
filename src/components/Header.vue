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

interface ShowType {
  dijkstra: boolean;
  spira: boolean;
  zwick: boolean;
}

const show: ShowType = inject("show")!

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
        pastSelectedEdges = pastSelectedEdges.filter(x => x != key)
      }
      if (edges[key].target == nodeId){
        selectedEdges.value.push(key)
        pastSelectedEdges = pastSelectedEdges.filter(x => x != key)
      }
    }
    removeEdge()
    // delete data.nodes[nodeId]
    delete nodes[nodeId]
  }
  selectedNodes.value = []
  selectedEdges.value = pastSelectedEdges
  console.log(selectedEdges)
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
  selectedEdges.value = []
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
    <!-- NODES AND EDGES -->
    <div class="graph-manipulation">
      <div class="nodes">
        <el-button class="equal-btn" @click="addNode">add node</el-button>
        <el-button class="equal-btn" :disabled="selectedNodes.length == 0" @click="removeNode">remove node</el-button>
      </div>
      <div class="edges">
        <el-button :disabled="selectedNodes.length != 2" @click="addEdge">add edge</el-button>
        <el-button :disabled="selectedEdges.length == 0" @click="removeEdge">remove edge</el-button>
      </div>
    
      <div class="edge-weight">
        <el-button :disabled="selectedEdges.length == 0" @click="updateEdgeWeight">update edge weight</el-button>
        <input class="text-input" type="integer" id="weightInput" placeholder="input new edge weight">
      </div>

      <div>
        <label class="label">Starting node: </label>
        <el-select class="selection" 
                  v-model="startingNodeName">
          <el-option class="option" v-for="node in nodes"
          :key="node.id"
          :label="node.name"
          :value="node.name"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <!-- SWITCHING OFF COMPONENTS -->
    <div class="toggles">
      <label class="label label-colored"> Dijkstra section: </label>
      <div class="toggle" :class="{ active: show.dijkstra }" @click="show.dijkstra = !show.dijkstra"> {{ show.dijkstra ? "✔" : "✖" }} </div>

      <label class="label label-colored"> Spira section: </label>
      <div class="toggle" :class="{ active: show.spira }" @click="show.spira = !show.spira"> {{ show.spira ? "✔" : "✖" }} </div>

      <label class="label label-colored"> Wilson-Zwick section: </label>
      <div class="toggle" :class="{ active: show.zwick }" @click="show.zwick = !show.zwick"> {{ show.zwick ? "✔" : "✖" }} </div>
    </div>
    <!-- <label>{{ selectedEdges }}</label>
    <label>{{ selectedNodes }}</label> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Header",
  }
)
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between; /* Ensure even spacing */
  align-items: center; /* Align items vertically */
  gap: 20px; /* Space between sections */
  flex-wrap: wrap; /* Prevents breaking on small screens */
  background-color: #F2D45C;
  padding: 5px;
  font-size: 20px;
  border: 1px solid #000000;
}
.graph-manipulation {
  display: flex;
  gap: 20px; /* Space between buttons */
}
.nodes {
  display: flex;
  flex-direction: column;
  padding: 3px;
  gap: 3px;
}
.equal-btn {
  width: 100 !important;
  text-align: center;
}
.edges {
  display: flex;
  flex-direction: column;
  padding: 3px;
  gap: 3px;
}
.edge-weight {
  display: flex;
  flex-direction: column;
  padding: 3px;
  gap: 3px;
}
.selection{
  max-width: 80px;
  color: #000000;
  border: 0.5px solid #000000;
  border-radius: 5px;
}
.option {
  color: #000000;
}
::v-deep(.el-select .el-select__selected-item) {
  color: #000000 !important;
}
.text-input{
  height: 32px;
  border: 0.5px solid #000000;
  border-radius: 5px;
  text-align: center;
}
</style>
