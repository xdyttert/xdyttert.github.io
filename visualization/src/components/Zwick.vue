<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import { Zwick, initialization } from "../algorithms/wilson-zwick";
import data from "../data/startingGraph";
import GraphAlgorithm from "./GraphAlgorithm.vue";

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

let relaxedEdgesZwick = 0
let scannedEdgesZwick = 0

</script>

<template>
  <GraphAlgorithm
    label="Wilson-Zwick"
    :initialization="initialization"
    :iterator="Zwick"
    :numOfRelaxedEdges="ref(relaxedEdgesZwick)"
    :numOfScannedEdges="ref(scannedEdgesZwick)"
    :configs="data.configsZwick"
    @update:selected-nodes="selectedNodes = $event"
    @update:selected-edges="selectedEdges = $event"
    distanceKey="distanceZwick"
    QKey="isInQZwick"
    PKey="isInPZwick"
    cKey="colorZwick"
    prKey="prevZwick"
    helpSite="../../public/explainWilsonZwick.html"
  />
</template>
  
  <script lang="ts">
  import { defineComponent } from "vue";

  
  export default defineComponent({
    name: "Zwick",
  });
</script>