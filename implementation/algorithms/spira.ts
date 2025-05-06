import PriorityQueue from "ts-priority-queue";
import { Edge, Node, Nodes, Edges } from "../../data/graph";
import { relax } from "./dijkstra"

/**
 * @global
 * @description `Minimum priority queue` used for edges
 *  during the algorithm each `edge` has value of it's
 *  `key` stored in atribute `.queueKey`
 */
const P = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.queueKey - edge2.queueKey})

/**
 * @global
 * @description represents number of already solved nodes
 *  during the algorithm
 */
let solvedNum = 0

/**
 * @global
 * @description represents total number of nodes of inputed graph
 */
let vertexNum = 0

/**
 * 
 * @param u node to be forwarded
 * @description function forward adds the `next outgoing
 *  edge` from node `u` to queue `P`
 */
function forward(u: Node){
    let edge = u.out.next()
    if (edge != null){
        edge.queueKey = u.d + edge.weight
        P.queue(edge)
    }
}

/**
 * 
 * @param s starting node
 * @param nodes graph represented by collection of nodes,
 *  each node has a atribute `.out` which represents
 *  outgoing adjacency list of this node
 * @description function spira runs Spiras's algorithm
 *  on graph represented by `nodes` from starting node `s`
 * @post all nodes have parameters:
 *      - `.d` set to the shortest distance from `s`
 *      - `.prev` set to the previous node in the shortest path
 */
export function spira(s: Node, nodes: Nodes){
    P.clear()
    solvedNum = 0
    vertexNum = 0

    for(const key in nodes){
        const u = nodes[key]
        u.d = Infinity
        u.prev = null
        u.out.reset()
    }

    // vertexNum = bfs(source, nodes, edges) TODO decide if you want this
    s.d = 0
    s.solved = true

    solvedNum++
    forward(s)

    while (solvedNum != vertexNum && P.length > 0){
        const edge = P.dequeue()
        const u = nodes[edge.source]
        const v = nodes[edge.target]

        forward(u)
        if (!v.solved){
            relax(u, v, edge)
        }
    }
}
