<script setup lang="ts">
import type { Edges, Layouts, Nodes } from "v-network-graph";
import * as vNG from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { oneStepZwick, zwick } from "../algorithms/zwick";
import data from "../data/startingGraph";
import GraphAlgorithm from "./GraphAlgorithm.vue";
import { updateNodes, updateEdges } from "../utils/utils";

const nodes: Nodes = inject("nodes")!
const edges: Edges = inject("edges")!

const graph = ref<vNG.Instance>()

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

const zwickStep = ref(0)

const layouts: Layouts = inject("layouts")!

function resetZwick(){
  zwickStep.value = 0
}
</script>

<template>
  <GraphAlgorithm
    label="Wilson-Zwick"
    :algorithm="oneStepZwick"
    :step="ref(zwickStep)"
    :reset="resetZwick"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="data.configsZwick"
    :selected-nodes="selectedNodes"
    :selected-edges="selectedEdges"
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