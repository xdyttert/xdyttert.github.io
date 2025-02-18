import data from "@/data/startingGraph";
import PriorityQueue from "ts-priority-queue";
import { type Edge, type Edges, type Node, type Nodes } from "v-network-graph";
import { inject, ref } from "vue";

const P = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.queueKey - edge2.queueKey})
let solvedNum = 0
let vertexNum = 0
const lastEdge: Node = ref({})
const lastNode: Node = ref({})

function forward(vertex: Node){
    let edge = vertex.out.next()
    console.log(edge)
    if (edge != null){
        edge.queueKey = vertex.distanceSpira + edge.weight
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
        vertex.prev = null
        vertex.out.reset()
        vertex.colorSpira = "blue"
        vertex.solved = false
        vertexNum++
    }
    source.distanceSpira = 0
    forward(source)

    while(solvedNum != vertexNum && P.length > 0){
        const edge = P.dequeue()
        const vertex = nodes[edge.source]
        const successor = nodes[edge.target]
        forward(vertex)
        if (!successor.solved){
            successor.distanceSpira = vertex.distanceSpira + edge.weight
            successor.prev = vertex
            solvedNum++
            successor.solved = true
            forward(successor)
        }
    }
    for(const key in nodes){
        const vertex = nodes[key]
        vertex.colorSpira = "blue"
    }
}

export function oneStepSpira(step: number, source: Node, nodes: Nodes, edges: Edges){
    if (step == 0){
        P.clear()
        lastEdge.value = {}
        lastNode.value = {}
        solvedNum = 0
        vertexNum = 0
        for(const key in nodes){
            const vertex = nodes[key]
            vertex.distanceSpira = Infinity
            vertex.prev = null
            vertex.out.reset()
            vertex.colorSpira = "blue"
            vertex.solved = false
            vertexNum++
        }
        for (const key in edges){
            edges[key].colorSpira = "blue"
        }
        source.distanceSpira = 0
        forward(source)
        return
    }

    lastEdge.value.colorSpira = "green";
    lastNode.value.colorSpira = "green";
    if(solvedNum != vertexNum && P.length > 0){
        const edge = P.dequeue()
        edge.colorSpira = "red"
        lastEdge.value = edge
        const vertex = nodes[edge.source]
        vertex.colorSpira = "green"
        const successor = nodes[edge.target]
        successor.colorSpira = "red"
        lastNode.value = successor
        forward(vertex)
        if (!successor.solved){
            successor.distanceSpira = vertex.distanceSpira + edge.weight
            successor.prev = vertex
            solvedNum++
            successor.solved = true
            forward(successor)
        }
    }
}
