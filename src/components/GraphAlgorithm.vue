<script setup lang="ts">
import { type VNetworkGraphInstance, type Layouts } from "v-network-graph";
import { defineProps, defineEmits, type Ref, ref, provide, inject, onMounted, nextTick } from "vue";
import { findNodeByName, shortestPathsTree, updateEdges, updateNodes, wait } from "../utils/utils";
import { showPertinent, animate, type Animate } from "../utils/store";
import { ZwickConstants } from "../utils/store"
import { type Node, type Edge, type Nodes, type Edges } from "../data/startingGraph";

const startingNodeName: Ref<string> = inject("startingNodeName")!

const nodes: Nodes = inject("nodes")!
const edges: Edges = inject("edges")!

const selectedNodes: Ref<string[], string[]> = inject("selectedNodesProv")!
const selectedEdges: Ref<string[], string[]> = inject("selectedEdgesProv")!
  
const props = defineProps<{
  label: String,
  initialization: (
    nodes: Nodes,
    edges: Edges,
    numOfRelaxededges: Ref<number>
  ) => void,
  iterator: (
    source: Node,
    nodes: Nodes,
    edges: Edges,
    numOfRelaxededges: Ref<number>
  ) => Generator<any, void, unknown>,
  numOfRelaxedEdges: Ref<number>,
  numOfScannedEdges: Ref<number>,
  configs: Object,
  distanceKey: String,
  cKey: String,
  QKey: String,
  PKey: String,
  prKey: String,
}>();

const distanceKeyt = props.distanceKey as keyof Node
const QKeyt = props.QKey as keyof Edge
const PKeyt = props.PKey as keyof Edge
const colorKey = props.cKey as keyof Edge
const prevKey = props.prKey as keyof Node
const animateKey = (props.label == "Wilson-Zwick" ? "zwick" : props.label.toLowerCase()) as keyof Animate
const layouts: Layouts = inject("layouts")!
const layers = {
  badge: "nodes",
}
const graph = ref<VNetworkGraphInstance | null>(null);

const fitGraphToContainer = () => {
  if (graph.value) {
    graph.value.fitToContents({
      margin: {
        top: 10,
        left: 10,
        right: 10,
        bottom: (window.innerWidth < 1000 ? 70 : 130)
      },
    });
  }
};

let iteratorAlg: Generator<any, void, unknown> | null = null
props.initialization(nodes, edges, ref(props.numOfRelaxedEdges))

const emit = defineEmits(["update:selectedNodes", "update:selectedEdges"]);
  
const updateSelectedNodes = (newValue: Ref<string[], string[]>) => {
  emit("update:selectedNodes", newValue);
};
  
const updateSelectedEdges = (newValue: Ref<string[], string[]>) => {
  emit("update:selectedEdges", newValue);
};

function reset(){
  props.initialization(nodes, edges, ref(props.numOfRelaxedEdges))
  iteratorAlg = null
  }

function runAlgorithm(){
  if (iteratorAlg == null){
      iteratorAlg = props.iterator(findNodeByName(nodes, startingNodeName.value), nodes, edges, ref(props.numOfRelaxedEdges))
  }
  iteratorAlg.next()
}

async function animateAlgorithm(){
  while(animate[animateKey]){
    await wait(700)
    if (iteratorAlg == null) { iteratorAlg = props.iterator(findNodeByName(nodes, startingNodeName.value), nodes, edges, ref(props.numOfRelaxedEdges)) }
    console.log("v cykle")
    if (iteratorAlg.next().done){ animate[animateKey] = false }
  }
}
</script>
  
  <template>
    <div>
      <div class="section-header">
        <div>
          <label class="label label-colored"> {{ label }}: </label>
          <el-button @click="runAlgorithm">></el-button>
          <el-button :class="{ active: animate[animateKey] }" @click="animate[animateKey] = !animate[animateKey]; animateAlgorithm()"> {{ animate[animateKey] ? "||" : ">>" }} </el-button>
          <el-button @click="reset">reset</el-button>
          <el-button @click="shortestPathsTree(nodes, edges, prevKey, colorKey)">SPT</el-button>

          <el-button @click="fitGraphToContainer">fit</el-button>

          <div v-if="label == 'Wilson-Zwick'" class="toggles-h">
            <label class="label label-colored">out:</label>
            <div class="toggle" :class="{ active: showPertinent.out }" @click="showPertinent.out = !showPertinent.out"> {{ showPertinent.out ? "✔" : "✖" }} </div>

            <label class="label label-colored">in:</label>
            <div class="toggle" :class="{ active: showPertinent.in }" @click="showPertinent.in = !showPertinent.in"> {{ showPertinent.in ? "✔" : "✖" }} </div>
          </div>
        </div>
        <div class="relaxed-edges">
          <div>
            <label class="label label-colored"> {{ numOfRelaxedEdges }} </label>
            <label class="label label-colored"> relaxed edges</label>
          </div>
          
          <div v-if="label=='Wilson-Zwick'">
          <label class="label label-colored">M: </label>
          <label class="label label-colored">{{ (ZwickConstants.M == Infinity ? '∞' : ZwickConstants.M ) }}</label>
          </div>
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
          :layers="layers"
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

          <template v-if="label == 'Wilson-Zwick'" #badge="{ scale }">
          <circle
            v-for="(pos, node) in layouts.nodes"
            :key="node"
            :cx="pos.x + 9 * scale"
            :cy="pos.y - 9 * scale"
            :r="4 * scale"
            :fill="nodes[node].isOut ? '#00cc00' : '#ff5555'"
            style="pointer-events: none"
          />
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
  flex: 1;
  height: 70px;
}
.relaxed-edges {
  display: flex;  
  justify-content: flex-end; 
  align-items: center; 
  gap: 0px;
  flex-direction: column;
}
.bold-label {
  font-weight: bold;
}
.toggles-h {
  display: flex;
  gap: 0px;
  align-items: center; 
}
</style>
