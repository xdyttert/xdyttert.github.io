<script setup lang="ts">
import type { Edges, Layouts, Nodes } from "v-network-graph";
import * as vNG from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { oneStepSpira, spira } from "../algorithms/spira";
import data from "../data/startingGraph";
import GraphAlgorithm from "./GraphAlgorithm.vue";
import { updateNodes, updateEdges } from "../utils/utils";


const nodes: Nodes = inject("nodes")!
const edges: Edges = inject("edges")!

const graph = ref<vNG.Instance>()

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!

const spiraStep = ref(0)

const layouts: Layouts = inject("layouts")!

function handleSpira(){
  console.log(data.nodes)
  spira(data.nodes["node1"], nodes, edges)
  updateNodes(nodes)
}

function forwardStepSpira(){
  oneStepSpira(spiraStep.value, data.nodes["node1"], nodes, edges);
  updateNodes(nodes);
  updateEdges(edges);
  spiraStep.value++;
}

function resetSpira(){
  spiraStep.value = 0
}
</script>

<template>
  <GraphAlgorithm
    label="Spira"
    :algorithm="oneStepSpira"
    :step="ref(spiraStep)"
    :reset="resetSpira"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="data.configsSpira"
    :selected-nodes="selectedNodes"
    :selected-edges="selectedEdges"
    @update:selected-nodes="selectedNodes = $event"
    @update:selected-edges="selectedEdges = $event"
    distanceKey="distanceSpira"
  />
</template>  

<script lang="ts">
  import { defineComponent } from "vue";
import { da } from "element-plus/es/locales.mjs";
  
  export default defineComponent({
    name: "Spira",
  });
</script>