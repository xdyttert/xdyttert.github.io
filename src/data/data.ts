import { type Nodes, type Edges, type Layouts, defineConfigs, type Edge, type Node } from "v-network-graph"
import { reactive } from "vue"
import { SortedLinkedList } from "./linkedList"

export const compareFunc = (a: Node, b: Node) => a.weight < b.weight

const nodes: Nodes = {
  node1: { name: "N1", distance: 0, solved: false, prev: null, color: "blue", isOut: true, activate: true, out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc), req: new SortedLinkedList<Node>(compareFunc) },
  node2: { name: "N2", distance: 0, solved: false, prev: null, color: "blue", isOut: true, activate: true, out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc), req: new SortedLinkedList<Node>(compareFunc) },
  node3: { name: "N3", distance: 0, solved: false, prev: null, color: "blue", isOut: true, activate: true, out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc), req: new SortedLinkedList<Node>(compareFunc) },
  node4: { name: "N4", distance: 0, solved: false, prev: null, color: "blue", isOut: true, activate: true, out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc), req: new SortedLinkedList<Node>(compareFunc) },
  node5: { name: "N5", distance: 0, solved: false, prev: null, color: "blue", isOut: true, activate: true, out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc), req: new SortedLinkedList<Node>(compareFunc) },
  node6: { name: "N6", distance: 0, solved: false, prev: null, color: "blue", isOut: true, activate: true, out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc), req: new SortedLinkedList<Node>(compareFunc) },
  node7: { name: "N7", distance: 0, solved: false, prev: null, color: "blue", isOut: true, activate: true, out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc), req: new SortedLinkedList<Node>(compareFunc) },
  node8: { name: "N8", distance: 0, solved: false, prev: null, color: "blue", isOut: true, activate: true, out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc), req: new SortedLinkedList<Node>(compareFunc) },
  node9: { name: "N9", distance: 0, solved: false, prev: null, color: "blue", isOut: true, activate: true, out: new SortedLinkedList<Node>(compareFunc), in: new SortedLinkedList<Node>(compareFunc), req: new SortedLinkedList<Node>(compareFunc) },
}

const edges: Edges = {
  edge1: { source: "node1", target: "node2", weight: 5, color: "blue", queueKey: 0 },
  edge2: { source: "node2", target: "node3", weight: 7, color: "blue", queueKey: 0 },
  edge3: { source: "node2", target: "node4", weight: 2, color: "blue", queueKey: 0 },
  edge4: { source: "node2", target: "node5", weight: 3, color: "blue", queueKey: 0 },
  edge5: { source: "node5", target: "node6", weight: 2, color: "blue", queueKey: 0 },
  edge6: { source: "node5", target: "node7", weight: 8, color: "blue", queueKey: 0 },
  edge7: { source: "node3", target: "node7", weight: 2, color: "blue", queueKey: 0 },
  edge8: { source: "node4", target: "node9", weight: 1, color: "blue", queueKey: 0 },
  edge9: { source: "node7", target: "node9", weight: 3, color: "blue", queueKey: 0 },
  edge10: { source: "node4", target: "node8", weight: 1, color: "blue", queueKey: 0 },
  edge11: { source: "node8", target: "node9", weight: 5, color: "blue", queueKey: 0 },
  edge12: { source: "node8", target: "node3", weight: 3, color: "blue", queueKey: 0 },
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

const configs = reactive(defineConfigs<Node, Edge>({
  node: {
    selectable: 2, // up to 2 nodes
    normal: {
      color: node => node.color
    }
  },
  edge: {
    selectable: true,
    normal: {
      width: 3,
      color: edge => edge.color
    },
    marker: {
      target: {
        type: "arrow"
      }
    }
  },
}))

export function makeEdgesLists(){
  for(const key in edges){
    const edge = edges[key]
    const source = edge.source
    const target = edge.target
    nodes[source].out.insertNode(edge)
    nodes[target].in.insertNode(edge)
  }
}

export default {
  nodes,
  edges,
  layouts,
  configs,
}