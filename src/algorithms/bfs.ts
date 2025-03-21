import type { Edges, Nodes, Node } from "v-network-graph";
import PriorityQueue from "ts-priority-queue";
import { ro } from "element-plus/es/locales.mjs";


const Q: PriorityQueue<Node> = new PriorityQueue({comparator: () => 1})

export function bfs(root: Node, nodes: Nodes, edges: Edges): number{
    let explored = 0
    Q.clear()
    for (const key in nodes){
        let u = nodes[key]
        u.exploredBFS = false
    }
    root.exploredBFS = true
    explored++
    Q.queue(root)
    while(Q.length > 0){
        let u = Q.dequeue()

        for (const key in edges){
            let edge = edges[key]
            if (nodes[edge.source] == u){
                let v = nodes[edge.target]
                if (!v.exploredBFS){
                    v.exploredBFS = true
                    explored++
                    Q.queue(v)
                }
            }
        }
    }
    return explored
}