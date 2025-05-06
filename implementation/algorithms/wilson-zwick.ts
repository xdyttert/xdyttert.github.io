import PriorityQueue from "ts-priority-queue";
import { Edge, Node, Nodes, Edges, compareFunc } from "../data/graph";
import { relax } from "./dijkstra"
import { SortedLinkedList } from "../data/linkedList";

/**
 * @global
 * @description `Minimum priority queue` used for edges
 *  that lead to undiscovered nodes during the algorithm 
 *  each `edge` has value of it's `key` stored in 
 *  atribute `.queueKey`
 */
const P = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.queueKey - edge2.queueKey})

/**
 * @global
 * @description `Minimum priority queue` used for finding 
 *  in-pertinent edges during the key for each edge is it's `weight`
 */
const Q = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.weight - edge2.weight})

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
 * @global
 * @description represents median value of lengths of shortest paths 
 *  in graph from starting node, at the start of the algorithm 
 *  has value Infinity until the median distance is known
 */
let M = Infinity

/**
 * 
 * @param P priority queue
 * @returns - Infinity, if `P` is empty
 *          - minimal key of all edges stored in `P` otherwise
 */
function min(P: PriorityQueue<Edge>){
    if (P.length == 0){ return Infinity }
    return P.peek().queueKey
}

/**
 * 
 * @param u node to be forwarded
 * @description function forward scans the next 
 *  outgoing edge from `u` if it is out-pertinent given to
 *  current value of `M` it adds it to `P`. 
 *  Else it tries to add next requested edge to `P`.
 * @post attributes of `u`:
 *      - `u.Out` tells wether `u.out` may contain out-pertinent edges
 *      - `u.active` tells wether there are edges in `u.out` or `u.req`
 *          waiting for scan
 */
function forward(u: Node){
    let edge: Edge | null = null
    if (u.Out){
        edge = u.out.next()
        if (edge == null || edge.weight > 2*(M - u.d)){ // edge is out-pertinent
            u.Out = false
        }
    }
    if (!u.Out){
        edge = u.req.next()
    }

    u.active = (edge != null)
    if ((edge != null)){ // u.active
        edge.queueKey = edge.weight + u.d
        P.queue(edge)
    }
}

/**
 * 
 * @param u node to be backwarded
 * @description tries do add next incoming edge of `u`
 *  to `Q`
 */
function backward(u: Node){
    let edge = u.in.next()

    if (edge != null){
        Q.queue(edge)
    }
}

/**
 * 
 * @param u node that `edge` is requested to
 * @param edge edge to be requested
 * @description function request adds `edge` to `u.req`
 *  if `u` is solved and not active the reques is urgent
 *  and function also forwards `u`
 */
function request(u: Node, edge: Edge){
    u.req.insertNode(edge)
    if (u.solved && !u.active){ // this means that the request is urgent
        forward(u)
    } 
}

/**
 * 
 * @param s starting node
 * @param nodes graph represented by collection of nodes,
 *  each node has a attribute `.out` which represents
 *  outgoing adjacency list of this node and attribute `.in` which
 *  represent incoming adjacency list of this node
 * @description function wilson_zwick runs algorithm of Wilson and Zwick
 *  on graph represented by `nodes` from starting node `s`
 * @post all nodes have parameters:
 *      - `.d` set to the shortest distance from `s`
 *      - `.prev` set to the previous node in the shortest path
 */
export function wilson_zwick(s: Node, nodes: Nodes){
    P.clear()                   // initialize constants
    Q.clear()
    vertexNum = 0
    solvedNum = 0
    M = Infinity
    for(const key in nodes){  // intialize attributes of nodes
        const u = nodes[key]
        u.d = Infinity
        u.prev = null
        u.out.reset()
        u.in.reset()
        u.req = new SortedLinkedList<Edge>(compareFunc)
        u.solved = false
        u.Out = true
        u.active = false
        vertexNum++
    }

    s.d = 0
    solvedNum++
    s.solved = true
    // vertexNum = bfs(source, nodes, edges) TODO decide if you want to keep this
    forward(s)

    while (solvedNum != vertexNum && P.length > 0){
        let edge = P.dequeue()

        let u = nodes[edge.source]
        let v = nodes[edge.target]
        forward(u)

        if (!v.solved){
            relax(u, v, edge)

            if (solvedNum == Math.ceil(vertexNum / 2)){  // now we know the median distance
                M = v.d              
                for (const key in nodes){  // find in-pertinent edges
                    let w = nodes[key]

                    if (!w.solved){
                        backward(w)
                    }
                }
            }
        }

        while ((Q.length > 0 && Q.peek().weight < 2 * (min(P) - M))){ 
            let edge = Q.dequeue()
         
            let u = nodes[edge.source]
            let v = nodes[edge.target]

            if (!v.solved){  // edge is in-pertinent
                backward(v)
                request(u, edge)
            }
        }   
    }
}
