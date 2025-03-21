import PriorityQueue from "ts-priority-queue";
import data from "../data/startingGraph"
import { type Edge, type Edges, type Node, type Nodes, VNetworkGraph } from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { tr } from "element-plus/es/locales.mjs";

const Q = new PriorityQueue({comparator: (node1: Node, node2: Node) => node1.distanceDijkstra - node2.distanceDijkstra})
const lastNode: Node = ref({})
const lastEdges = ref<Edge[]>([])

export function dijkstra(source: Node, nodes: Nodes, edges: Edges){
    // INITIALIZATION
    Q.clear()
    for (const key in nodes){
        const u = nodes[key];
        u.distanceDijkstra = Infinity;
        u.prevDijkstra = null;
        u.solvedDijkstra = false;
    };
    source.distanceDijkstra = 0;
    Q.queue(source)

    while (Q.length > 0){
        const u = Q.dequeue()!;

        for(const key in edges){
            const v = nodes[edges[key].target]
            if (nodes[edges[key].source] == u && !v.solvedDijkstra){
                const newDistance = u.distanceDijkstra + edges[key].weight;
                if (newDistance < v.distanceDijkstra){
                    v.distanceDijkstra = newDistance;
                    v.prevDijkstra = u
                    Q.queue(v)
                }
            }
        };
        u.solvedDijkstra = true;
    }
}

export function initialization(nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){
    lastNode.value = {}
    lastEdges.value = []
    Q.clear()
    numOfRelaxededges.value = 0
    for (const key in nodes){
        const u = nodes[key];
        u.distanceDijkstra = Infinity;
        u.prevDijkstra = null;
        u.solvedDijkstra = false;
        u.colorDijkstra = "blue";
        u.isInQDijkstra = false
    };
    for (const key in edges){
        edges[key].colorDijkstra = "blue"
    }
}

function relax(u: Node, v: Node, edge: Edge, numOfRelaxededges: Ref<number>){
    v.distanceDijkstra = u.distanceDijkstra + edge.weight;
    v.prevDijkstra = u;
    if (!v.isInQDijkstra) { Q.queue(v); v.isInQDijkstra = true }
    v.colorDijkstra = "gray";
    edge.colorDijkstra = "red";
    lastEdges.value.push(edge);
    numOfRelaxededges.value++
}

export function oneStepDijkstra(step: number, source: Node, nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){
    if (step == 0) { initialization(nodes, edges, numOfRelaxededges); return }

    if (step == 1) {
        source.distanceDijkstra = 0;
        Q.queue(source)
        source.isInQDijkstra = true
        return
    }

    lastNode.value.colorDijkstra = "green"
    for (const key in lastEdges.value){
        lastEdges.value[key].colorDijkstra = "green";
        delete lastEdges.value[key]
    }

    if (Q.length > 0){
        console.log(Q)
        const u = Q.dequeue()
        u.isInQDijkstra = false
        u.colorDijkstra = "red"
        lastNode.value = u
        for(const key in edges){
            const edge = edges[key]
            const v = nodes[edge.target]
            
            if (nodes[edge.source] == u){
                lastEdges.value.push(edge)
                edge.colorDijkstra = "orange"
                if (u.distanceDijkstra + edge.weight < v.distanceDijkstra){
                    relax(u, v, edge, numOfRelaxededges)
                }
            }
        };
        u.solvedDijkstra = true;
    }
}