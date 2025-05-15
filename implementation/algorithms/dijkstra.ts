import PriorityQueue from "ts-priority-queue";
import { Edge, Node, Nodes } from "../data/graph";

/**
 * @global 
 * @description Minimum priority queue used for nodes
 *  during the algorithm key for each node
 *  is atribute d
 */
const Q = new PriorityQueue({comparator: 
                            (node1: Node, node2: Node) => node1.d - node2.d
                        })

/**
 * 
 * @param u initial node of the edge
 * @param v terminal node of the edge
 * @param edge edge `(u, v)`
 * @description function relax sets parameters 
 * `u.d` and `u.prev` to correct values when new shortest 
 * path to node `u` from starting node `s` is found
 */
export function relax(u: Node, v: Node, edge: Edge){
    v.d = u.d + edge.weight;
    v.prev = u;
}

/**
 * 
 * @param s starting node
 * @param nodes graph represented by collection of nodes,
 *  each node has a atribute `.outDijkstra` which represents
 *  outgoing adjacency list of this node
 * @description function dijkstra runs Dijkstra's algorithm
 *  on graph represented by `nodes` from starting node `s`
 * @post all nodes have parameters:
 *      - `.d` set to the shortest distance from `s`
 *      - `.prev` set to the previous node in the shortest path
 */
export function dijkstra(s: Node, nodes: Nodes){
    Q.clear()
    for (const key in nodes){
        const u = nodes[key];
        u.d = Infinity;
        u.prev = null;
    };

    s.d = 0;
    Q.queue(s)

    while (Q.length > 0){
        const u = Q.dequeue()

        for (const edge of u.outDijkstra){
            const v = nodes[edge.target]

            if (u.d + edge.weight < v.d){
                relax(u, v, edge)
            }
        }
    }
}
