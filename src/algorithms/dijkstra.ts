import PriorityQueue from "ts-priority-queue";
import data from "../data/startingGraph"
import { type Edge, type Edges, type Node, type Nodes, VNetworkGraph } from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { tr } from "element-plus/es/locales.mjs";

const Q = new PriorityQueue({comparator: (node1: Node, node2: Node) => node1.distanceDijkstra - node2.distanceDijkstra})

export function dijkstra(source: Node, nodes: Nodes, edges: Edges){
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
    numOfRelaxededges.value++
}

export function* Dijkstra(source: Node, nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){
    source.distanceDijkstra = 0;
    Q.queue(source)
    source.isInQDijkstra = true
    yield

    while (Q.length > 0){
        let scannedEdges: Edge[] = []
        const u = Q.dequeue()
        u.isInQDijkstra = false
        u.colorDijkstra = "green"
        u.solvedDijkstra = true

        for (const edge of u.outDijkstra){
            console.log(edge)
            const v = nodes[edge.target]

            scannedEdges.push(edge)
            edge.colorDijkstra = "orange"
            if (u.distanceDijkstra + edge.weight < v.distanceDijkstra){
                relax(u, v, edge, numOfRelaxededges)
            }
        }

        yield
        console.log(scannedEdges)
        for (const key in scannedEdges){
            scannedEdges[key].colorDijkstra = "green"
        }
    }
}
