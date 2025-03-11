import PriorityQueue from "ts-priority-queue";
import data from "../data/startingGraph"
import { type Edge, type Edges, type Node, type Nodes, VNetworkGraph } from "v-network-graph";
import { inject, ref } from "vue";
const Q = new PriorityQueue({comparator: (node1: Node, node2: Node) => node1.distanceDijkstra - node2.distanceDijkstra})
const lastNode: Node = ref({})
const lastEdges = ref<Edge[]>([])

// const nodes: Nodes = inject("nodes")!
// const edges: Edges = inject("edges")!

export function dijkstra(source: Node, nodes: Nodes, edges: Edges){
    // INITIALIZATION
    Q.clear()
    for (const key in nodes){
        const vertex = nodes[key];
        vertex.distanceDijkstra = Infinity;
        vertex.prevDijkstra = null;
        vertex.solvedDijkstra = false;
    };
    source.distanceDijkstra = 0;
    Q.queue(source)

    while (Q.length > 0){
        const u = Q.dequeue()!;

        for(const key in edges){
            const succ = nodes[edges[key].target]
            if (nodes[edges[key].source] == u && !succ.solvedDijkstra){
                const newDistance = u.distanceDijkstra + edges[key].weight;
                if (newDistance < succ.distanceDijkstra){
                    succ.distanceDijkstra = newDistance;
                    succ.prevDijkstra = u
                    Q.queue(succ)
                }
            }
        };
        u.solvedDijkstra = true;
    }
}

export function oneStepDijkstra(step: number, source: Node, nodes: Nodes, edges: Edges){
    console.log("bezi dijkstra")
    console.log(source)
    console.log(nodes)
    console.log(step)
    if(step == 0){
        lastNode.value = {}
        lastEdges.value = []
        Q.clear()
        for (const key in nodes){
            const vertex = nodes[key];
            vertex.distanceDijkstra = Infinity;
            vertex.prevDijkstra = null;
            vertex.solvedDijkstra = false;
            vertex.colorDijkstra = "blue";
        };
        for (const key in edges){
            edges[key].colorDijkstra = "blue"
        }
        source.distanceDijkstra = 0;
        Q.queue(source)
        return
    };

    lastNode.value.colorDijkstra = "green"
    for (const key in lastEdges.value){
        lastEdges.value[key].colorDijkstra = "green";
        delete lastEdges.value[key]
    }

    const u = Q.dequeue()!
    u.colorDijkstra = "red"
    lastNode.value = u

    for(const key in edges){
        const edge = edges[key]
        const succ = nodes[edge.target]
        if (nodes[edge.source] == u && !succ.solvedDijkstra){
            
            const newDistance = u.distanceDijkstra + edge.weight;
            if (newDistance < succ.distanceDijkstra){
                succ.distanceDijkstra = newDistance;
                succ.prevDijkstra = u;
                Q.queue(succ);
                succ.colorDijkstra = "gray";
                edge.colorDijkstra = "red";
                lastEdges.value.push(edge);
            }
        }
    };
    u.solvedDijkstra = true;
}
