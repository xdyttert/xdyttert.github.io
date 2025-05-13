<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import { Dijkstra, initialization } from "../algorithms/dijkstra";
import data from "../data/startingGraph";
import GraphAlgorithm from "./GraphAlgorithm.vue";

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

let relaxedEdgesDijkstra = 0
let scannedEdgesDijkstra = 0

</script>

<template>
  <GraphAlgorithm
    label="Dijkstra"
    :initialization="initialization"
    :iterator="Dijkstra"
    :numOfRelaxedEdges="ref(relaxedEdgesDijkstra)"
    :numOfScannedEdges="ref(scannedEdgesDijkstra)"
    :configs="data.configsDijkstra"
    @update:selected-nodes="selectedNodes = $event"
    @update:selected-edges="selectedEdges = $event"
    distanceKey="distanceDijkstra"
    QKey="isInQDijkstra"
    PKey="isInPDijkstra"
    cKey="colorDijkstra"
    prKey="prevDijkstra"
    helpSite="/explainDijkstra.html"
  />
</template>
  
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "Dijkstra",
  });
</script>
    