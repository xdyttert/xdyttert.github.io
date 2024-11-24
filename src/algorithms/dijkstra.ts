import PriorityQueue from "ts-priority-queue";
import data from "../data/data"
import { type Edge, type Edges, type Node, type Nodes, VNetworkGraph } from "v-network-graph";
import { ref } from "vue";
const Q = new PriorityQueue({comparator: (node1: Node, node2: Node) => node1.distance - node2.distance})
const lastNode: Node = ref({})
const lastEdges = ref<Edge[]>([])

export function dijkstra(source: Node){
    // INITIALIZATION
    Q.clear()
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

export function oneStepDijkstra(step: number, source: Node){
    if(step == 0){
        lastNode.value = {}
        lastEdges.value = []
        Q.clear()
        for (const key in data.nodes){
            const vertex = data.nodes[key];
            vertex.distance = Infinity;
            vertex.prev = null;
            vertex.solved = false;
            vertex.color = "blue";
        };
        for (const key in data.edges){
            data.edges[key].color = "blue"
        }
        source.distance = 0;
        Q.queue(source)
        return
    };
    lastNode.value.color = "green"
    for (const key in lastEdges.value){
        lastEdges.value[key].color = "green";
        delete lastEdges.value[key]
    }
    const u = Q.dequeue()!;
    u.color = "red"
    lastNode.value = u

    for(const key in data.edges){
        const edge = data.edges[key]
        const succ = data.nodes[edge.target]
        if (data.nodes[edge.source] == u && !succ.solved){
            
            const newDistance = u.distance + edge.weight;
            if (newDistance < succ.distance){
                succ.distance = newDistance;
                succ.prev = u;
                Q.queue(succ);
                succ.color = "gray"
                edge.color = "red"
                lastEdges.value.push(edge)
            }
        }
    };
    u.solved = true;
}
