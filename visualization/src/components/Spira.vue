<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import { initialization, Spira } from "../algorithms/spira";
import data from "../data/startingGraph";
import GraphAlgorithm from "./GraphAlgorithm.vue";

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

let relaxedEdgesSpira = 0
let scannedEdgesSpira = 0

</script>

<template>
  <GraphAlgorithm
    label="Spira"
    :initialization="initialization"
    :iterator="Spira"
    :numOfRelaxedEdges="ref(relaxedEdgesSpira)"
    :numOfScannedEdges="ref(scannedEdgesSpira)"
    :configs="data.configsSpira"
    @update:selected-nodes="selectedNodes = $event"
    @update:selected-edges="selectedEdges = $event"
    distanceKey="distanceSpira"
    QKey="isInQSpira"
    PKey="isInPSpira"
    cKey="colorSpira"
    prKey="prevSpira"
    helpSite="../../public/explainSpira.html"
  />
</template>  

<script lang="ts">
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "Spira",
  });
</script>