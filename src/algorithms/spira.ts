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
        vertex.prevSpira = null
        vertex.out.reset()
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

export function oneStepSpira(step: number, source: Node, nodes: Nodes, edges: Edges){
    console.log("bezi spira")
    console.log(source)
    console.log(nodes)
    console.log(step)
    if (step == 0){
        P.clear()
        lastEdge.value = {}
        lastNode.value = {}
        solvedNum = 0
        vertexNum = 0
        for(const key in nodes){
            const vertex = nodes[key]
            vertex.distanceSpira = Infinity
            vertex.prevSpira = null
            vertex.out.reset()
            vertex.colorSpira = "blue"
            vertex.solvedSpira = false
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
        if (!successor.solvedSpira){
            successor.distanceSpira = vertex.distanceSpira + edge.weight
            successor.prevSpira = vertex
            solvedNum++
            successor.solvedSpira = true
            forward(successor)
        }
    }
}
