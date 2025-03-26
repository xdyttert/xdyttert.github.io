import data from "@/data/startingGraph";
import PriorityQueue from "ts-priority-queue";
import { type Edge, type Edges, type Node, type Nodes } from "v-network-graph";
import { inject, ref, type Ref } from "vue";
import { bfs } from "./bfs";

const P = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.queueKeySpira - edge2.queueKeySpira})
let solvedNum = 0
let vertexNum = 0
const lastEdge: Node = ref({})
const lastNode: Node = ref({})

function forward(vertex: Node){
    let edge = vertex.outSpira.next()
    if (edge != null){
        edge.queueKeySpira = vertex.distanceSpira + edge.weight
        P.queue(edge)
        edge.colorSpira = "gray"
    }
}

export function spira(source: Node, nodes: Nodes, edges: Edges){
    P.clear()
    solvedNum = 0
    vertexNum = 0
    for(const key in nodes){
        const vertex = nodes[key]
        vertex.distanceSpira = Infinity
        vertex.prevSpira = null
        vertex.outSpira.reset()
        vertex.colorSpira = "blue"
        vertex.solvedSpira = false
        vertexNum++
    }
    source.distanceSpira = 0
    forward(source)

    while(solvedNum != vertexNum && P.length > 0){
        const edge = P.dequeue()
        const vertex = nodes[edge.source]
        const successor = nodes[edge.target]
        forward(vertex)
        if (!successor.solvedSpira){
            successor.distanceSpira = vertex.distanceSpira + edge.weight
            successor.prevSpira = vertex
            solvedNum++
            successor.solvedSpira = true
            forward(successor)
        }
    }
    for(const key in nodes){
        const vertex = nodes[key]
        vertex.colorSpira = "blue"
    }
}

export function initialization(nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){
    P.clear()
    lastEdge.value = {}
    lastNode.value = {}
    solvedNum = 0
    vertexNum = 0
    numOfRelaxededges.value = 0
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

export function oneStepSpira(step: number, source: Node, nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){
    if (step == 0){ initialization(nodes, edges, numOfRelaxededges); return }

    if (step == 1){
        vertexNum = bfs(source, nodes, edges)
        source.distanceSpira = 0
        source.solvedSpira = true
        solvedNum++
        forward(source)
        return
    }
    lastEdge.value.colorSpira = "green";
    lastNode.value.colorSpira = "green";

    if(solvedNum != vertexNum && P.length > 0){
        
        const edge = P.dequeue()
        edge.colorSpira = "orange"
        lastEdge.value = edge
        const u = nodes[edge.source]
        u.colorSpira = "green"
        const v = nodes[edge.target]
        lastNode.value = v
        forward(u)
        if (!v.solvedSpira){
            relax(u, v, edge, numOfRelaxededges)
        }

        return
    }
    return -1
}

export function* Spira(source: Node, nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){

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
        lastEdge.value = edge
        const u = nodes[edge.source]
        // u.colorSpira = "green"
        const v = nodes[edge.target]
        lastNode.value = v
        forward(u)
        if (!v.solvedSpira){
            relax(u, v, edge, numOfRelaxededges)
        }

        yield
        v.colorSpira = "green"
        edge.colorSpira = "green"
    }
}
