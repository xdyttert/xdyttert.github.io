<script setup lang="ts">
import { type Nodes, type Edges } from "v-network-graph";
import { defineProps, defineEmits, type Ref, ref, provide, inject } from "vue";
import { forwardStepAlgorithm } from "../utils/utils";

const startingNodeName: Ref<string> = inject("startingNodeName")!
  
  const props = defineProps<{
    label: String,
    algorithm: Function,
    step: Ref<number>,
    reset: Function,
    nodes: Nodes,
    edges: Edges,
    layouts: Object,
    configs: Object,
    selectedNodes: Array<string>,
    selectedEdges: Array<string>,
    distanceKey: String,
  }>();

  const key = props.distanceKey as keyof Node
  
  const emit = defineEmits(["update:selectedNodes", "update:selectedEdges"]);
  
  const updateSelectedNodes = (newValue: Ref<string[], string[]>) => {
    emit("update:selectedNodes", newValue);
  };
  
  const updateSelectedEdges = (newValue: Ref<string[], string[]>) => {
    emit("update:selectedEdges", newValue);
  };
  </script>
  
  <template>
    <div>
      <div class="section">
        <div class="row">
          <label class="label label-colored"> {{ label }}: </label>
          <el-button @click="forwardStepAlgorithm(algorithm, step, ref(startingNodeName), nodes, edges)">></el-button>
          <el-button @click="reset">reset {{ label }}</el-button>
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
              {{ nodes[nodeId][key] }}
            </text>
          </template>
  
          <template #edge-label="{ edge, ...slotProps }">
            <v-edge-label :text="edge.weight" align="center" vertical-align="above" v-bind="slotProps" />
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
