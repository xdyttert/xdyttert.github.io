import data, { compareFunc } from "@/data/data"
import { SortedLinkedList } from "@/data/linkedList"
import PriorityQueue from "ts-priority-queue"
import type { Edge, Node } from "v-network-graph"
import { ref } from "vue"


function getEdge(sourceId: string, targetId: String){
    for (const key in data.edges){
        let edge = data.edges[key]
        if (edge.source == sourceId && edge.target == targetId){
            return edge
        }
    }
}

function getNodeId(node: Node){
    for (const key in data.nodes){
        if (data.nodes[key] == node){
            return key
        }
    }
    return ""
}

const P = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.queueKey - edge2.queueKey})
const Q = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.queueKey - edge2.queueKey})
let solvedNum = 0
let vertexNum = 0
let M: number = Infinity
const lastNodeGreen: Node = ref({})
const lastNodeBlue: Node = ref({})
const lastEdgesGreen = ref<Edge[]>([])
const lastEdgesBlue = ref<Edge[]>([])

function forward(vertex: Node){
    let edge = null
    if (vertex.isOut){
        edge = vertex.out.next()
        
        if (edge == null || edge.weight > 2*(M - vertex.distance)){
            vertex.isOut = false
        }
    }
    if (!vertex.isOut){
        edge = vertex.req.next()
    }

    vertex.activate = (edge != null)
    if (vertex.activate){
        edge.queueKey = edge.weight + vertex.distance
        edge.color = "gray"
        P.queue(edge)
    }
}

function backward(vertex: Node){
    let edge = vertex.in.next()

    if (edge != null){
        edge.queueKey = edge.weight
        edge.color = "black"
        Q.queue(edge)
    }
}

function request(vertex: Node, successor: Node){
    let edge = getEdge(getNodeId(vertex), getNodeId(successor))
    vertex.req.insertNode(edge)
    if (vertex.req.isLength1()){
        vertex.req.reset()
    }

    if (vertex.solved && !vertex.activate){
        forward(vertex)
    } 
}

export function zwick(source: Node){
    console.log(data.nodes)
    console.log(data.edges)
    M = Infinity
    P.clear()
    Q.clear()
    vertexNum = 0
    solvedNum = 0
    for(const key in data.nodes){
        const vertex = data.nodes[key]
        vertex.distance = Infinity
        vertex.prev = null
        vertex.out.reset()
        vertex.in.reset()
        vertex.color = "blue"
        vertex.solved = false
        vertex.isOut = true
        vertex.activate = false
        vertex.req = new SortedLinkedList<Node>(compareFunc)
        vertexNum++
    }

    source.distance = 0
    source.solved = true
    forward(source)

    while (solvedNum != vertexNum && P.length > 0){

        let edge = P.dequeue()
        let vertex = data.nodes[edge.source]
        let successor = data.nodes[edge.target]
        forward(vertex)

        if (!successor.solved){
            successor.distance = vertex.distance + edge.weight
            successor.prev = vertex
            solvedNum++
            successor.solved = true
            forward(successor)

            if (solvedNum == Math.ceil(vertexNum / 2)){
                M = successor.distance
                for (const key in data.nodes){
                    let notSolvedVertex = data.nodes[key]

                    if (!notSolvedVertex.solved){
                        backward(notSolvedVertex)
                    }
                }
            }
        }

        while (Q.length > 0 && Q.peek().queueKey < 2 * ((P.length > 0 ? P.peek().queueKey : Infinity) - M)){
            let edge = Q.dequeue()
            let vertex = data.nodes[edge.source]
            let successor = data.nodes[edge.target]

            if (!successor.solved){
                backward(successor)
                request(vertex, successor)
            }
        }
    }
}

export function oneStepZwick(step: number, source: Node, innerCycle: boolean){
    console.log(P)
    console.log(Q)
    if (step == 0){
        lastEdgesGreen.value = []
        lastEdgesBlue.value = []
        lastNodeGreen.value = {}
        lastNodeBlue.value = {}
        vertexNum = 0
        solvedNum = 0
        P.clear()
        Q.clear()
        M = Infinity
        for(const key in data.nodes){
            const vertex = data.nodes[key]
            vertex.distance = Infinity
            vertex.prev = null
            vertex.out.reset()
            vertex.in.reset()
            vertex.req = new SortedLinkedList<Node>(compareFunc)
            vertex.color = "blue"
            vertex.solved = false
            vertex.isOut = true
            vertex.activate = false
            vertexNum++
        }
        for (const key in data.edges){
            data.edges[key].color = "blue"
        }
        source.distance = 0
        source.solved = true
        forward(source)
        return false
    }
    lastNodeBlue.value.color = "blue"
    lastNodeBlue.value = {}
    lastNodeGreen.value.color = "green"
    for (const key in lastEdgesGreen.value){
        lastEdgesGreen.value[key].color = "green";
        delete lastEdgesGreen.value[key]
    }

    if (!innerCycle){
        if (solvedNum != vertexNum && P.length > 0){

            let edge = P.dequeue()
            lastEdgesGreen.value.push(edge)
            edge.color = "red"
            let vertex = data.nodes[edge.source]
            vertex.color = "green"
            let successor = data.nodes[edge.target]
            successor.color = "red"
            lastNodeGreen.value = successor
            forward(vertex)

            if (!successor.solved){
                successor.distance = vertex.distance + edge.weight
                successor.prev = vertex
                solvedNum++
                successor.solved = true
                forward(successor)

                if (solvedNum == Math.ceil(vertexNum / 2)){
                    M = successor.distance
                    console.log(M)
                    for (const key in data.nodes){
                        let notSolvedVertex = data.nodes[key]

                        if (!notSolvedVertex.solved){
                            backward(notSolvedVertex)
                        }
                    }
                }
            }
        }
        return (Q.length > 0 && Q.peek().queueKey < 2 * ((P.length > 0 ? P.peek().queueKey : Infinity) - M))
    }
    if (innerCycle){
        console.log("som v inner cycle")
        let edge = Q.dequeue()
        edge.color = "magenta"
        lastEdgesBlue.value.push(edge)
        let vertex = data.nodes[edge.source]
        //vertex.color = "green"
        let successor = data.nodes[edge.target]
        successor.color = "magenta"
        if (successor.solved){
            lastNodeGreen.value = successor
            lastEdgesGreen.value.push(edge)
        }
        else {
            lastEdgesBlue.value.push(edge)
            lastNodeBlue.value = successor
        }
        if (!successor.solved){
            backward(successor)
            request(vertex, successor)
        }
    }
    return (Q.length > 0 && Q.peek().queueKey < 2 * ((P.length > 0 ? P.peek().queueKey : Infinity) - M))
}
