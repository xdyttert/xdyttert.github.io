<script setup lang="ts">
import { inject, type Ref, ref } from "vue";
import data from "../data/startingGraph"
import { Dijkstra, initialization } from "../algorithms/dijkstra";

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

let relaxedEdgesDijkstra = 0

</script>

<template>
  <GraphAlgorithm
    label="Dijkstra"
    :initialization="initialization"
    :iterator="Dijkstra"
    :numOfRelaxedEdges="ref(relaxedEdgesDijkstra)"
    :configs="data.configsDijkstra"
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
    