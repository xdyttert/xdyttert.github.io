import PriorityQueue from "ts-priority-queue";
import { type Edges, type Node, type Nodes } from "../data/startingGraph";


const Q: PriorityQueue<Node> = new PriorityQueue({comparator: () => 1})

export function bfs(root: Node, nodes: Nodes, edges: Edges): number{
    let explored = 0
    const exploredBFS = new Map<Node, boolean>()
    Q.clear()
    for (const key in nodes){
        let u = nodes[key]
        exploredBFS.set(u, false)
    }
    exploredBFS.set(root, true)
    explored++
    Q.queue(root)
    while(Q.length > 0){
        let u = Q.dequeue()

        for (const key in edges){
            let edge = edges[key]
            if (nodes[edge.source] == u){
                let v = nodes[edge.target]
                if (!exploredBFS.get(v)){
                    exploredBFS.set(v, true)
                    explored++
                    Q.queue(v)
                }
            }
        }
    }
    return explored
}