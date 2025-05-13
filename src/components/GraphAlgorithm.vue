<script setup lang="ts">
import { type Layouts, type VNetworkGraphInstance } from "v-network-graph";
import { defineEmits, defineProps, inject, type Ref, ref } from "vue";
import { type Edge, type Edges, type Node, type Nodes } from "../data/startingGraph";
import { animate, type Animate, showPertinent, ZwickConstants } from "../utils/store";
import { findNodeByName, shortestPathsTree, wait, trueInPertinent, trueOutPertinent } from "../utils/utils";

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
    numOfRelaxededges: Ref<number>,
    numOfScannedEdges: Ref<number>
  ) => void,
  iterator: (
    source: Node,
    nodes: Nodes,
    edges: Edges,
    numOfRelaxededges: Ref<number>,
    numOfScannedEdges: Ref<number>
  ) => Generator<any, void, unknown>,
  numOfRelaxedEdges: Ref<number>,
  numOfScannedEdges: Ref<number>,
  configs: Object,
  distanceKey: String,
  cKey: String,
  QKey: String,
  PKey: String,
  prKey: String,
  helpSite: string,
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
// props.initialization(nodes, edges, ref(props.numOfRelaxedEdges), ref(props.numOfScannedEdges))

const emit = defineEmits(["update:selectedNodes", "update:selectedEdges"]);
  
const updateSelectedNodes = (newValue: Ref<string[], string[]>) => {
  emit("update:selectedNodes", newValue);
};
  
const updateSelectedEdges = (newValue: Ref<string[], string[]>) => {
  emit("update:selectedEdges", newValue);
};

function reset(){
  props.initialization(nodes, edges, ref(props.numOfRelaxedEdges), ref(props.numOfScannedEdges))
  iteratorAlg = null
}

function runAlgorithm(){
  if (iteratorAlg == null){
      iteratorAlg = props.iterator(findNodeByName(nodes, startingNodeName.value), nodes, edges, ref(props.numOfRelaxedEdges), ref(props.numOfScannedEdges))
  }
  iteratorAlg.next()
}

async function animateAlgorithm(){
  while(animate[animateKey]){
    await wait(700)
    if (iteratorAlg == null) { iteratorAlg = props.iterator(findNodeByName(nodes, startingNodeName.value), nodes, edges, ref(props.numOfRelaxedEdges), ref(props.numOfScannedEdges)) }
    if (iteratorAlg.next().done){ animate[animateKey] = false }
  }
}
</script>
  
  <template>
    <div>
      <div class="section-header">
        <div>
          <label class="label label-colored"> {{ label }}: </label>
          <el-button @click="reset">init</el-button>
          <el-button @click="runAlgorithm">></el-button>
          <el-button :class="{ active: animate[animateKey] }" @click="animate[animateKey] = !animate[animateKey]; animateAlgorithm()"> {{ animate[animateKey] ? "||" : ">>" }} </el-button>
          <el-button @click="shortestPathsTree(nodes, edges, prevKey, colorKey)">SPT</el-button>

          <el-button @click="fitGraphToContainer">fit</el-button>

          <div v-if="label == 'Wilson-Zwick'" class="toggles-h">
            <label class="label label-colored">out:</label>
            <div class="toggle" :class="{ active: showPertinent.out }" @click="showPertinent.out = !showPertinent.out"> {{ showPertinent.out ? "✔" : "✖" }} </div>

            <label class="label label-colored">in:</label>
            <div class="toggle" :class="{ active: showPertinent.in }" @click="showPertinent.in = !showPertinent.in"> {{ showPertinent.in ? "✔" : "✖" }} </div>

            <el-button @click="trueOutPertinent(nodes, edges, ZwickConstants.M)">true-out</el-button>
            <el-button @click="trueInPertinent(nodes, edges, ZwickConstants.M)">true-in</el-button>

            <label class="label label-colored">inner:</label>
            <div class="toggle" :class="{ active: showPertinent.innerCycle }" @click="showPertinent.innerCycle = !showPertinent.innerCycle"> {{ showPertinent.innerCycle ? "✔" : "✖" }} </div>

            <div class="M-div">
              <label class="label label-colored">M:</label>
              <label class="label label-colored M">{{ (ZwickConstants.M == Infinity ? '∞' : ZwickConstants.M ) }}</label>
            </div>
          </div>
          
        </div>
        <div class="relaxed-edges">
          <div>
            <label class="label label-colored"> {{ numOfRelaxedEdges }} </label>
            <label class="label label-colored"> relaxed</label>
          </div>

          <div>
            <label class="label label-colored"> {{ numOfScannedEdges }} </label>
            <label class="label label-colored"> scanned</label>
          </div>
          
        </div>
        <a :href="helpSite" class="help-icon">?</a>
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
}
);
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
  height: 100px;
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
  margin-top: 7px;
  display: flex;
  gap: 7px;
  align-items: center; 
}
.M-div{
  margin-left: 5px;
  margin-right: 5px;
}
.M{
  margin-left: 5px;
}
.help-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  background-color: #F2D45C;
  color: #333;
  text-align: center;
  font-weight: bold;
  text-decoration: none;
  font-family: sans-serif;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid #000000;
}
.help-icon:hover {
  background-color: #fff; /* Default Element Plus primary color */
  border-color: #409EFF;
}
</style>