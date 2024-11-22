import data from "../data/data"
import heap from "heap"
import { type Edge, type Node, type Nodes, VNetworkGraph } from "v-network-graph";


export function dijkstra(source: Node){
    // INITIALIZATION
    const Q = new heap<Node>();
    for (const key in data.nodes){
        const vertex = data.nodes[key];
        vertex.distance = Infinity;
        vertex.prev = null;
        vertex.solved = false;
        Q.push(vertex)
    };
    source.distance = 0;


    while (!Q.empty()){
        const u = Q.pop()!;
        console.log(u);

        for(const key in data.edges){
            const succ = data.nodes[data.edges[key].target]
            if (data.nodes[data.edges[key].source] == u && !succ.solved){
                const newDistance = u.distance + data.edges[key].weight;
                if (newDistance < succ.distance){
                    succ.distance = newDistance;
                    succ.prev = u
                }
            }
        };
        u.solved = true;
    }
}