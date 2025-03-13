<script setup lang="ts">
import { type Nodes, type Edges, type Edge, type Node } from "v-network-graph";
import { defineProps, defineEmits, type Ref, ref, provide, inject } from "vue";
import { forwardStepAlgorithm } from "../utils/utils";

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
    QKey: String,
    PKey: String,
  }>();

  const distanceKeyt = props.distanceKey as keyof Node
  const QKeyt = props.QKey as keyof Edge
  const PKeyt = props.PKey as keyof Edge
  const Q = "Q"
  const P = "P"
  let step = 0
  
  
  const emit = defineEmits(["update:selectedNodes", "update:selectedEdges"]);
  
  const updateSelectedNodes = (newValue: Ref<string[], string[]>) => {
    emit("update:selectedNodes", newValue);
  };
  
  const updateSelectedEdges = (newValue: Ref<string[], string[]>) => {
    emit("update:selectedEdges", newValue);
  };

  function resetS(algorithm: Function, nodes: Nodes, edges: Edges){
      step = 0
      step = forwardStepAlgorithm(algorithm, step, ref(startingNodeName), nodes, edges)
  }
  </script>
  
  <template>
    <div>
      <div class="section-header">
        <div>
          <label class="label label-colored"> {{ label }}: </label>
          <el-button @click="step = forwardStepAlgorithm(algorithm, step, ref(startingNodeName), nodes, edges)">></el-button>
          <el-button @click="resetS(algorithm, nodes, edges)">reset</el-button>
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
            <text x="0" y="0" :font-size="9 * scale" text-anchor="middle" dominant-baseline="central" fill="#ffffff">
              {{ nodes[nodeId].name }}
            </text>
            <text x="0" y="0" :font-size="config.fontSize * scale" :text-anchor="textAnchor"
              :dominant-baseline="dominantBaseline" :fill="config.color" :transform="`translate(${x} ${y})`">
              {{ nodes[nodeId][distanceKeyt] }}
            </text>
          </template>
  
          <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label :text="edge.weight" align="center" vertical-align="above" v-bind="slotProps"/>
            <v-edge-label :text="Q" text-anchor="start" vertical-align="below" v-if="edge[QKeyt]" v-bind="slotProps"/>
            <v-edge-label :text="P" text-anchor="end" dx="-10" vertical-align="below" v-if="edge[PKeyt]" v-bind="slotProps"/>
            
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
}
</style>
