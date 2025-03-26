<script setup lang="ts">
import { inject, ref, type Ref } from "vue";
import data from "../data/startingGraph"
import { Zwick, initialization } from "../algorithms/zwick";

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

const relaxedEdgesZwick = ref(0)

</script>

<template>
  <GraphAlgorithm
    label="Wilson-Zwick"
    :initialization="initialization"
    :iterator="Zwick"
    :numOfRelaxedEdges="ref(relaxedEdgesZwick)"
    :configs="data.configsZwick"
    @update:selected-nodes="selectedNodes = $event"
    @update:selected-edges="selectedEdges = $event"
    distanceKey="distanceZwick"
    QKey="isInQZwick"
    PKey="isInPZwick"
    cKey="colorZwick"
    prKey="prevZwick"
  />
</template>
  
  <script lang="ts">
  import { defineComponent } from "vue";

  
  export default defineComponent({
    name: "Zwick",
  });
</script>