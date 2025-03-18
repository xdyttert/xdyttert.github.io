<script setup lang="ts">
import { type Nodes, type Edges, type Edge, type Node } from "v-network-graph";
import { defineProps, defineEmits, type Ref, ref, provide, inject } from "vue";
import { forwardStepAlgorithm, shortestPathsTree } from "../utils/utils";
import { showPertinent } from "@/utils/store";

const startingNodeName: Ref<string> = inject("startingNodeName")!
  
  const props = defineProps<{
    label: String,
    algorithm: Function,
    nodes: Nodes,
    edges: Edges,
    layouts: Object,
    configs: Object,
    selectedNodes: Array<string>,
    selectedEdges: Array<string>,
    distanceKey: String,
    cKey: String,
    QKey: String,
    PKey: String,
    prKey: String,
  }>();

  const distanceKeyt = props.distanceKey as keyof Node
  const QKeyt = props.QKey as keyof Edge
  const PKeyt = props.PKey as keyof Edge
  let step = 0
  let numOfrelaxedEdges = ref(0)
  const colorKey = props.cKey as keyof Edge
  const prevKey = props.prKey as keyof Node
  
  const emit = defineEmits(["update:selectedNodes", "update:selectedEdges"]);
  
  const updateSelectedNodes = (newValue: Ref<string[], string[]>) => {
    emit("update:selectedNodes", newValue);
  };
  
  const updateSelectedEdges = (newValue: Ref<string[], string[]>) => {
    emit("update:selectedEdges", newValue);
  };

  function resetS(algorithm: Function, nodes: Nodes, edges: Edges){
      step = 0
      const result = forwardStepAlgorithm(algorithm, step, ref(startingNodeName), nodes, edges, ref(numOfrelaxedEdges))
      step = result[0]
      numOfrelaxedEdges.value = result[1]
  }

function runAlg(algorithm: Function, nodes: Nodes, edges: Edges){
      const result = forwardStepAlgorithm(algorithm, step, ref(startingNodeName), nodes, edges, ref(numOfrelaxedEdges))
      step = result[0]
      numOfrelaxedEdges.value = result[1]
      console.log(numOfrelaxedEdges)
  }
  </script>
  
  <template>
    <div>
      <div class="section-header">
        <div>
          <label class="label label-colored"> {{ label }}: </label>
          <el-button @click="runAlg(algorithm, nodes, edges)">></el-button>
          <el-button @click="resetS(algorithm, nodes, edges)">reset</el-button>
          <el-button @click="shortestPathsTree(nodes, edges, prevKey, colorKey)">show SPT</el-button>

          <div v-if="label == 'Wilson-Zwick'" class="toggles">
            <label class="label label-colored">out-pertinent: </label>
            <div class="toggle" :class="{ active: showPertinent.out }" @click="showPertinent.out = !showPertinent.out"> {{ showPertinent.out ? "✔" : "✖" }} </div>

            <label class="label label-colored">in-pertinent: </label>
            <div class="toggle" :class="{ active: showPertinent.in }" @click="showPertinent.in = !showPertinent.in"> {{ showPertinent.in ? "✔" : "✖" }} </div>
          </div>
        </div>
        <div class="relaxed-edges">
          <label class="label label-colored"> {{ numOfrelaxedEdges }} </label>
          <label class="label label-colored"> relaxed edges</label>
        </div>
      </div>
  
      <div class="graph">
        <v-network-graph
          :nodes="nodes"
          :edges="edges"
          :layouts="layouts"
          :configs="configs"
          :selected-nodes="selectedNodes"
          :selected-edges="selectedEdges"
          @update:selected-nodes="updateSelectedNodes"
          @update:selected-edges="updateSelectedEdges"
          ref="graph"
        >
        
          <template #override-node-label="{ nodeId, scale, x, y, config, textAnchor, dominantBaseline }">
            <text x="0" y="0" :font-size="(config.fontSize - 2) * scale" text-anchor="middle" dominant-baseline="central" fill="#ffffff">
              {{ nodes[nodeId].name }}
            </text>
            <text x="0" y="0" :font-size="config.fontSize * scale" :text-anchor="textAnchor"
              :dominant-baseline="dominantBaseline" :fill="config.color" :transform="`translate(${x} ${y})`">
              {{ ( nodes[nodeId][distanceKeyt] == Infinity ? '∞' : nodes[nodeId][distanceKeyt]) }}
            </text>
          </template>
  
          <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label :text="edge.weight" align="center" vertical-align="above" v-bind="slotProps"/>
            <v-edge-label :text="'𝒬'" :style="{ fontSize: '10px' }" class="bold-label" text-anchor="start" dx="8" dy="-10" vertical-align="below" v-if="edge[QKeyt]" v-bind="slotProps"/>
            <v-edge-label :text="'𝑃'" :style="{ fontSize: '10px' }" class="bold-label" text-anchor="end" dx="-8" dy="-10" vertical-align="below" v-if="edge[PKeyt]" v-bind="slotProps"/>
            
          </template>
        </v-network-graph>
      </div>
    </div>
  </template>

  <script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "GraphAlgorithm",
  });
</script>

<style scoped>
.section-header{
  background-color: #F2D45C;
  padding: 5px;
  font-size: 20px;
  gap: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.relaxed-edges {
  display: flex;  /* Ensure the relaxed-edges div stays inline */
  justify-content: flex-end; /* Align content to the right */
  align-items: center; /* Vertically center the content */
  gap: 0px;
}
.bold-label {
  font-weight: bold;
}
</style>
