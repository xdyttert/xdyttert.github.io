<script setup lang="ts">
import { type Layouts } from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { SortedLinkedList } from "../data/linkedList";
import { compareFunc, makeEdgesLists, type Edge, type Edges, type Nodes } from "../data/startingGraph";
import { getEdge, updateEdges, updateNodes } from "../utils/utils";
import { fullGraphNodes, fullGraphEdges, fullGraphLayouts } from "../data/fullGraph8Nodes";
import { startingGraphNodes, startingGraphEdges, startingGraphLayouts } from "../data/startingGraph";
import { fullGraph4Nodes, fullGraph4NodesEdges, fullGraph4NodesLayouts } from "../data/fullGraph4Nodes";
import { binaryTreeNodes, binaryTreeEdges, binaryTreeLayouts } from "../data/treeGraph";
import { Visual } from "../utils/store";

let nodes: Nodes = inject("nodes")!
let edges: Edges = inject("edges")!

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
  nodes[nodeId] = { name: name, distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, 
                    isInQDijkstra: false,
                    exploredBFS: false,
                    solvedDijkstra: false, solvedSpira: false, solvedZwick: false, 
                    prevDijkstra: null, prevSpira: null, prevZwick: null, 
                    colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", 
                    isOut: true, active: true, 
                    outDijkstra: [],
                    outSpira: new SortedLinkedList<Edge>(compareFunc), 
                    outZwick: new SortedLinkedList<Edge>(compareFunc), 
                    in: new SortedLinkedList<Edge>(compareFunc), 
                    req: new SortedLinkedList<Edge>(compareFunc) },
  layouts.nodes[nodeId] = {x: 360, y: -50}
  nextNodeIndex.value++
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
    delete nodes[nodeId]
    delete layouts.nodes[nodeId]
  }
  selectedNodes.value = []
  selectedEdges.value = pastSelectedEdges
}

function addEdge() {
  if (selectedNodes.value.length !== 2) { return }
  const [source, target] = selectedNodes.value
  let s = nodes[source]
  let t = nodes[target]
  let existingEdge = getEdge(source, target, edges)

  if (existingEdge != null) { alert('Edge from node "' + s.name + '" to node "' + t.name + '" already exists.'); return }

  let newEdgeWeight = 0

  let newWeightString = (document.getElementById("weightInput")! as HTMLInputElement).value
  let newWeight = Number(newWeightString)
  if (!Number.isNaN(newWeight) && newWeight >= 0) { newEdgeWeight = newWeight }

  const edgeId = `edge${nextEdgeIndex.value}`
  const edge = { source: source, target: target, weight: newEdgeWeight, 
                 colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", 
                 PKeySpira: 0, QKeyZwick: 0, PKeyZwick: 0, 
                 isInPSpira: false, 
                 isInQZwick: false, isInPZwick: false, 
                 inPertinent: false, outPertinent: false }
  edges[edgeId] = edge
  s.outSpira.insertNode(edge)
  s.outZwick.insertNode(edge)
  s.outDijkstra.push(edge)
  t.in.insertNode(edge)

  s.outSpira.reset()
  s.outZwick.reset()
  t.in.reset()
  nextEdgeIndex.value++
}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    let edge = edges[edgeId]
    let source = nodes[edge.source]
    let target = nodes[edge.target]

    source.outZwick.deleteNode(edge)
    source.outSpira.deleteNode(edge)
    source.outDijkstra = source.outDijkstra.filter((e: Edge) => e != edge)
    target.in.deleteNode(edge)

    delete edges[edgeId]
  }
  selectedEdges.value = []
}

function updateEdgeWeight(){
  let newWeightString = (document.getElementById("weightInput")! as HTMLInputElement).value
  let newWeight = Number(newWeightString)
  if (Number.isNaN(newWeight) || newWeight < 0) { 
    alert('Wrong edge weight "' + newWeightString + '". Please input nonnegative number.'); 
    return 
  }

  for (const edgeId of selectedEdges.value){
    let source = nodes[edges[edgeId].source]
    let target = nodes[edges[edgeId].target]
    let edge = edges[edgeId]

    source.outSpira.deleteNode(edge)
    source.outZwick.deleteNode(edge)
    target.in.deleteNode(edge)
    source.outDijkstra = source.outDijkstra.filter((e: Edge) => e != edge)

    let newEdge = edges[edgeId]
    newEdge.weight = newWeight

    source.outSpira.insertNode(newEdge)
    source.outZwick.insertNode(newEdge)
    target.in.insertNode(newEdge)
    source.outDijkstra.push(newEdge)
  }
  updateEdges(edges);
}

function generateRandomGraph(nodes: Nodes, edges: Edges){
  randomGraph(nodes, edges, layouts)
  
  updateNodes(nodes)
  updateEdges(edges)
  makeEdgesLists(nodes, edges)
  console.log(nodes)
  console.log(edges)
}

function loadGraph(nodes: Nodes, edges: Edges, layouts: Layouts, newNodes: Nodes, newEdges: Edges, newLayouts: Layouts) {
  for (const key in nodes){
    delete nodes[key]
    delete layouts.nodes[key]
  }

  console.log(nodes)
  console.log(layouts)
  console.log(newLayouts)
  for (const key in edges){
    delete edges[key]
  }

  for (const key in newNodes){
    nodes[key] = newNodes[key]
    layouts.nodes[key] = newLayouts.nodes[key]
  }

  for (const key in newEdges){
    edges[key] = newEdges[key]
  }

  makeEdgesLists(nodes, edges)
  updateNodes(nodes)
  
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
        <input class="text-input" type="integer" id="weightInput" placeholder="input edge weight">
      </div>

      <div>
        <label class="label">Starting node: </label>
        <el-select class="selection" 
                  v-model="startingNodeName">
          <el-option class="option" v-for="node in nodes"
          :key="node.name"
          :label="node.name"
          :value="node.name"
          >
          </el-option>
        </el-select>
      </div>
      <!-- GRAPHS -->
      <div class="graphs">
        <el-button @click="generateRandomGraph(nodes, edges)">Random graph</el-button>
        <el-button @click="loadGraph(nodes, edges, layouts, binaryTreeNodes, binaryTreeEdges, binaryTreeLayouts)">Binary tree</el-button>
      </div>
      <div class="graphs">
        <el-button @click="loadGraph(nodes, edges, layouts, startingGraphNodes, startingGraphEdges, startingGraphLayouts)">Starting graph</el-button>
        <el-button @click="loadGraph(nodes, edges, layouts, fullGraph4Nodes, fullGraph4NodesEdges, fullGraph4NodesLayouts)">Full graph 4 nodes</el-button>
      </div>
    </div>
    <div class="fonts">
      <label class="label">Font size</label>
      <input type="range" id="fontSize" v-model="Visual.fontSize" min="12" max="27" />

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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { randomGraph } from "../data/randomGraph";

export default defineComponent({
    name: "Header",
  }
)
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center; 
  gap: 20px; 
  flex-wrap: wrap; 
  background-color: #F2D45C;
  padding: 5px;
  font-size: 20px;
  border: 1px solid #000000;
}
.graph-manipulation {
  display: flex;
  gap: 20px; 
}
.nodes {
  display: flex;
  flex-direction: column;
  padding: 3px;
  gap: 3px;
}
.graphs {
  display: flex;
  flex-direction: column;
  padding: 3px;
  gap: 3px;
}
.equal-btn {
  display: flex;
  justify-content: center;
  min-width: 200 !important;
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
.fonts{
  display: flex;
  flex-direction: column;
}
</style>
