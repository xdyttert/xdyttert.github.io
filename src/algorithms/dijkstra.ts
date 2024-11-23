import PriorityQueue from "ts-priority-queue";
import data from "../data/data"
import { type Edge, type Node, type Nodes, VNetworkGraph } from "v-network-graph";


export function dijkstra(source: Node){
    // INITIALIZATION
    const Q = new PriorityQueue({comparator: (node1: Node, node2: Node) => node1.distance - node2.distance})
    for (const key in data.nodes){
        const vertex = data.nodes[key];
        vertex.distance = Infinity;
        vertex.prev = null;
        vertex.solved = false;
    };
    source.distance = 0;
    Q.queue(source)

    while (Q.length > 0){
        const u = Q.dequeue()!;
        console.log(u);

        for(const key in data.edges){
            const succ = data.nodes[data.edges[key].target]
            if (data.nodes[data.edges[key].source] == u && !succ.solved){
                const newDistance = u.distance + data.edges[key].weight;
                if (newDistance < succ.distance){
                    succ.distance = newDistance;
                    succ.prev = u
                    Q.queue(succ)
                }
            }
        };
        u.solved = true;
    }
}