import PriorityQueue from "ts-priority-queue";
import { type Ref } from "vue";
import { type Edge, type Edges, type Node, type Nodes } from "../data/startingGraph";
import { bfs } from "./bfs";

const P = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.PKeySpira - edge2.PKeySpira})
let solvedNum = 0
let vertexNum = 0

function forward(vertex: Node){
    let edge = vertex.outSpira.next()
    if (edge != null){
        edge.PKeySpira = vertex.distanceSpira + edge.weight
        P.queue(edge)
        edge.colorSpira = "gray"
    }
}

export function initialization(nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>, numOfScannedEdges: Ref<number>){
    P.clear()
    solvedNum = 0
    vertexNum = 0
    numOfRelaxededges.value = 0
    numOfScannedEdges.value = 0
    for(const key in nodes){
        const vertex = nodes[key]
        vertex.distanceSpira = Infinity
        vertex.prevSpira = null
        vertex.outSpira.reset()
        vertex.colorSpira = "blue"
        vertex.solvedSpira = false
    }
    for (const key in edges){
        edges[key].colorSpira = "blue"
    }
}

function relax(u: Node, v: Node, edge: Edge, numOfRelaxededges: Ref<number>){
    v.distanceSpira = u.distanceSpira + edge.weight
    v.prevSpira = u
    solvedNum++
    v.solvedSpira = true
    forward(v)
    numOfRelaxededges.value++
    edge.colorSpira = "red"
    v.colorSpira = "red"
}

export function* Spira(source: Node, nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>, numOfScannedEdges: Ref<number>){

    vertexNum = bfs(source, nodes, edges)
    source.distanceSpira = 0
    source.solvedSpira = true
    source.colorSpira = "green"
    solvedNum++
    forward(source)
    yield

    while (solvedNum != vertexNum && P.length > 0){
        const edge = P.dequeue()
        edge.colorSpira = "orange"
        numOfScannedEdges.value++
        const u = nodes[edge.source]
        const v = nodes[edge.target]

        forward(u)
        if (!v.solvedSpira){
            relax(u, v, edge, numOfRelaxededges)
        }

        yield
        v.colorSpira = "green"
        edge.colorSpira = "green"
    }
}
