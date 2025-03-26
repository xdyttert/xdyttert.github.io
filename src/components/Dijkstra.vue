<script setup lang="ts">
import type { Edges, Layouts, Nodes } from "v-network-graph";
import * as vNG from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { dijkstra, Dijkstra, initialization } from "../algorithms/dijkstra";
import data from "../data/startingGraph";
import GraphAlgorithm from "./GraphAlgorithm.vue";
import { updateNodes, updateEdges } from "../utils/utils";

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
    