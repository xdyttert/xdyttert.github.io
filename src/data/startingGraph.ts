import { showPertinent } from "@/utils/store"
import { type Layouts, defineConfigs } from "v-network-graph"
import { reactive } from "vue"
import { SortedLinkedList } from "./linkedList"

export const compareFunc = (a: Edge, b: Edge) => a.weight < b.weight

export interface Node {
  name: string
  distanceDijkstra: number
  distanceSpira: number
  distanceZwick: number
  isInQDijkstra: boolean
  exploredBFS: boolean
  solvedDijkstra: boolean
  solvedSpira: boolean
  solvedZwick: boolean
  prevDijkstra: Node | null
  prevSpira: Node | null
  prevZwick: Node | null
  colorDijkstra: string
  colorSpira: string
  colorZwick: string
  isOut: boolean
  active: boolean
  outDijkstra: Edge[]
  outSpira: SortedLinkedList<Edge>
  outZwick: SortedLinkedList<Edge>
  in: SortedLinkedList<Edge>
  req: SortedLinkedList<Edge>
}

export type Nodes = Record<string, Node>

const nodes: Nodes = {
  node1: { name: "N1", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node2: { name: "N2", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node3: { name: "N3", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node4: { name: "N4", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node5: { name: "N5", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node6: { name: "N6", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node7: { name: "N7", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node8: { name: "N8", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node9: { name: "N9", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
}

export interface Edge {
  source: string
  target: string
  weight: number
  colorDijkstra: string
  colorSpira: string
  colorZwick: string
  PKeySpira: number
  PKeyZwick: number
  isInPSpira: boolean
  isInQZwick: boolean
  isInPZwick: boolean
  inPertinent: boolean
  outPertinent: boolean
}

export type Edges = Record<string, Edge>

const edges: Edges = {
  edge1: { source: "node1", target: "node2", weight: 5, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge2: { source: "node2", target: "node3", weight: 7, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge3: { source: "node2", target: "node4", weight: 2, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge4: { source: "node2", target: "node5", weight: 3, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge5: { source: "node5", target: "node6", weight: 2, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge6: { source: "node5", target: "node7", weight: 8, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge7: { source: "node3", target: "node7", weight: 2, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge8: { source: "node4", target: "node9", weight: 1, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge9: { source: "node7", target: "node9", weight: 3, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge10: { source: "node4", target: "node8", weight: 1, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge11: { source: "node8", target: "node9", weight: 5, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
  edge12: { source: "node8", target: "node3", weight: 3, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false },
} 

const layouts: Layouts = {
  nodes: {
    node1: { x: 10, y: 10 },
    node2: { x: 120, y: 10 },
    node3: { x: 230, y: 10 },
    node4: { x: 270, y: 120 },
    node5: { x: 170, y: -100 },
    node6: { x: 300, y: -100 },
    node7: { x: 340, y: 10 },
    node8: { x: 450, y: 120 },
    node9: { x: 560, y: 10 },
  },
}

const configsDijkstra = reactive(defineConfigs<Node, Edge>({
  node: {
    selectable: 2, // up to 2 nodes
    label: {
      fontSize: 15
    },
    normal: {
      color: node => node.colorDijkstra
    }
  },
  edge: {
    selectable: true,
    normal: {
      width: 3,
      color: edge => edge.colorDijkstra
    },
    marker: {
      target: {
        type: "arrow"
      }
    },
    label: {
      fontSize: 15
    }
  },
}))

const configsSpira = reactive(defineConfigs <Node, Edge>({
  node: {
    selectable: 2, // up to 2 nodes
    label: {
      fontSize: 15
    },
    normal: {
      color: node => node.colorSpira
    }
  },
  edge: {
    selectable: true,
    normal: {
      width: 3,
      color: edge => edge.colorSpira
    },
    marker: {
      target: {
        type: "arrow"
      }
    },
    label: {
      fontSize: 15
    },
  },
}))

const configsZwick = reactive(defineConfigs<Node, Edge>({
  node: {
    selectable: 2, // up to 2 nodes
    label: {
      fontSize: 15
    },
    normal: {
      color: node => node.colorZwick
    }
  },
  edge: {
    selectable: true,
    normal: {
      width: 3,
      color: edge => edge.colorZwick,
      dasharray: edge => (edge.outPertinent && showPertinent.out ? "6" : (edge.inPertinent && showPertinent.in ? "2" : "0"))
    },
    marker: {
      target: {
        type: "arrow"
      }
    },
    label: {
      fontSize: 15
    },
  },
}))

export function makeEdgesLists(){
  for(const key in edges){
    const edge = edges[key]
    const source = edge.source
    const target = edge.target
    nodes[source].outDijkstra.push(edge)
    nodes[source].outZwick.insertNode(edge)
    nodes[source].outSpira.insertNode(edge)
    nodes[target].in.insertNode(edge)
  }
}

export default {
  nodes,
  edges,
  layouts,
  configsDijkstra,
  configsSpira,
  configsZwick,
}