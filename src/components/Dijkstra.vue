<script setup lang="ts">
import type { Edges, Layouts, Nodes } from "v-network-graph";
import * as vNG from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { dijkstra, oneStepDijkstra } from "../algorithms/dijkstra";
import data from "../data/startingGraph";
import GraphAlgorithm from "./GraphAlgorithm.vue";
import { updateNodes, updateEdges } from "../utils/utils";

const nodes: Nodes = inject("nodes")!
const edges: Edges = inject("edges")!

const graph = ref<vNG.Instance>()

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

const dijkstraStep = ref(0)

const layouts: Layouts = inject("layouts")!

function resetDijkstra(){
  dijkstraStep.value = 0
  console.log("restDijkstra")
  console.log(dijkstraStep.value)
}
</script>

<template>
  <GraphAlgorithm
    label="Dijkstra"
    :algorithm="oneStepDijkstra"
    :step="ref(dijkstraStep)"
    :reset="resetDijkstra"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="data.configsDijkstra"
    :selected-nodes="selectedNodes"
    :selected-edges="selectedEdges"
    @update:selected-nodes="selectedNodes = $event"
    @update:selected-edges="selectedEdges = $event"
    distanceKey="distanceDijkstra"
    QKey="isInQDijkstra"
    PKey="isInPDijkstra"
    cKey="colorDijkstra"
    prKey="prevDijkstra"
  />
</template>
  
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "Dijkstra",
  });
</script>
    