<script setup lang="ts">
import type { Edges, Layouts, Nodes } from "v-network-graph";
import * as vNG from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { initialization, spira, Spira } from "../algorithms/spira";
import data from "../data/startingGraph";
import GraphAlgorithm from "./GraphAlgorithm.vue";
import { updateNodes, updateEdges } from "../utils/utils";

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

let relaxedEdgesSpira = 0

</script>

<template>
  <GraphAlgorithm
    label="Spira"
    :initialization="initialization"
    :iterator="Spira"
    :numOfRelaxedEdges="ref(relaxedEdgesSpira)"
    :configs="data.configsSpira"
    @update:selected-nodes="selectedNodes = $event"
    @update:selected-edges="selectedEdges = $event"
    distanceKey="distanceSpira"
    QKey="isInQSpira"
    PKey="isInPSpira"
    cKey="colorSpira"
    prKey="prevSpira"
  />
</template>  

<script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "Spira",
  });
</script>