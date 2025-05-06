import { SortedLinkedList } from "./linkedList.ts"

export const compareFunc = (a: Edge, b: Edge) => a.weight < b.weight

/**
 * Represents a node in the graph with attributes used in Dijkstra's algorithm.
 *
 * @typedef {Object} Node
 * @property {number} d - The shortest distance from the source node.
 * @property {Node | null} prev - The previous node in the shortest path.
 * @property {boolean} solved - Whether the node's shortest path is finalized.
 * @property {boolean} Out - Indicates if the node is an outgoing node.
 * @property {boolean} active - Indicates if the node is currently active.
 * @property {Edge[]} outDijkstra - List of edges used in Dijkstra's algorithm.
 * @property {SortedLinkedList<Edge>} out - Outgoing edges sorted in a linked list.
 * @property {SortedLinkedList<Edge>} in - Incoming edges sorted in a linked list.
 * @property {SortedLinkedList<Edge>} req - Required edges sorted in a linked list.
 */
export type Node = {
  d: number
  prev: Node | null
  solved: boolean
  Out: boolean
  active: boolean
  outDijkstra: Edge[]
  out: SortedLinkedList<Edge>
  in: SortedLinkedList<Edge>
  req: SortedLinkedList<Edge>
}

export type Nodes = Record<string, Node>

export const nodes: Nodes = {
  node1: { d: 0, prev: null, solved: false, Out: true, active: true, outDijkstra: [], out: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node2: { d: 0, prev: null, solved: false, Out: true, active: true, outDijkstra: [], out: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node3: { d: 0, prev: null, solved: false, Out: true, active: true, outDijkstra: [], out: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node4: { d: 0, prev: null, solved: false, Out: true, active: true, outDijkstra: [], out: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node5: { d: 0, prev: null, solved: false, Out: true, active: true, outDijkstra: [], out: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node6: { d: 0, prev: null, solved: false, Out: true, active: true, outDijkstra: [], out: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node7: { d: 0, prev: null, solved: false, Out: true, active: true, outDijkstra: [], out: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node8: { d: 0, prev: null, solved: false, Out: true, active: true, outDijkstra: [], out: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node9: { d: 0, prev: null, solved: false, Out: true, active: true, outDijkstra: [], out: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
}

/**
 * Represents an edge in the graph.
 *
 * @typedef {Object} Edge
 * @property {string} source - The ID of the source node.
 * @property {string} target - The ID of the target node.
 * @property {number} weight - The weight of the edge.
 * @property {number} queueKey - A key used for priority queue operations.
 */
export type Edge = {
  source: string
  target: string
  weight: number
  queueKey: number
}

export type Edges = Record<string, Edge>

export const edges: Edges = {
  edge1: { source: "node1", target: "node2", weight: 5, queueKey: 0 },
  edge2: { source: "node2", target: "node3", weight: 7, queueKey: 0 },
  edge3: { source: "node2", target: "node4", weight: 2, queueKey: 0 },
  edge4: { source: "node2", target: "node5", weight: 3, queueKey: 0 },
  edge5: { source: "node5", target: "node6", weight: 2, queueKey: 0 },
  edge6: { source: "node5", target: "node7", weight: 8, queueKey: 0 },
  edge7: { source: "node3", target: "node7", weight: 2, queueKey: 0 },
  edge8: { source: "node4", target: "node9", weight: 1, queueKey: 0 },
  edge9: { source: "node7", target: "node9", weight: 3, queueKey: 0 },
  edge10: { source: "node4", target: "node8", weight: 1, queueKey: 0 },
  edge11: { source: "node8", target: "node9", weight: 5, queueKey: 0 },
  edge12: { source: "node8", target: "node3", weight: 3, queueKey: 0 },
} 

/**
 * @description adds the adges to the curresponding nodes lists
 */
export function makeEdgesLists(){
  for(const key in edges){
    const edge = edges[key]
    const source = edge.source
    const target = edge.target
    nodes[source].outDijkstra.push(edge)
    nodes[source].out.insertNode(edge)
    nodes[target].in.insertNode(edge)
  }
}