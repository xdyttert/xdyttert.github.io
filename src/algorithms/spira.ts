import data from "@/data/data";
import PriorityQueue from "ts-priority-queue";
import { type Edge, type Node } from "v-network-graph";
import { ref } from "vue";

const P = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.queueKey - edge2.queueKey})
let solvedNum = 0
let vertexNum = 0
const lastEdge: Node = ref({})
const lastNode: Node = ref({})

function forward(vertex: Node){
    let edge = vertex.out.next()
    console.log(edge)
    if (edge != null){
        edge.queueKey = vertex.distance + edge.weight
        P.queue(edge)
        edge.color = "gray"
    }
}

export function spira(source: Node){
    P.clear()
    let solvedNum = 0
    let vertexNum = 0
    for(const key in data.nodes){
        const vertex = data.nodes[key]
        vertex.distance = Infinity
        vertex.prev = null
        vertex.out.reset()
        vertex.color = "blue"
        vertex.solved = false
        vertexNum++
    }
    source.distance = 0
    forward(source)

    while(solvedNum != vertexNum && P.length > 0){
        const edge = P.dequeue()
        const vertex = data.nodes[edge.source]
        const successor = data.nodes[edge.target]
        forward(vertex)
        if (!successor.solved){
            successor.distance = vertex.distance + edge.weight
            successor.prev = vertex
            solvedNum++
            successor.solved = true
            forward(successor)
        }
    }
    for(const key in data.nodes){
        const vertex = data.nodes[key]
        vertex.color = "blue"
    }
}

export function oneStepSpira(step: number, source: Node){
    if (step == 0){
        P.clear()
        lastEdge.value = {}
        lastNode.value = {}
        solvedNum = 0
        vertexNum = 0
        for(const key in data.nodes){
            const vertex = data.nodes[key]
            vertex.distance = Infinity
            vertex.prev = null
            vertex.out.reset()
            vertex.color = "blue"
            vertex.solved = false
            vertexNum++
        }
        for (const key in data.edges){
            data.edges[key].color = "blue"
        }
        source.distance = 0
        forward(source)
        return
    }

    lastEdge.value.color = "green";
    lastNode.value.color = "green";
    if(solvedNum != vertexNum && P.length > 0){
        const edge = P.dequeue()
        edge.color = "red"
        lastEdge.value = edge
        const vertex = data.nodes[edge.source]
        vertex.color = "green"
        const successor = data.nodes[edge.target]
        successor.color = "red"
        lastNode.value = successor
        forward(vertex)
        if (!successor.solved){
            successor.distance = vertex.distance + edge.weight
            successor.prev = vertex
            solvedNum++
            successor.solved = true
            forward(successor)
        }
    }
}
