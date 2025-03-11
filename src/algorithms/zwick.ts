import data, { compareFunc } from "@/data/startingGraph"
import { SortedLinkedList } from "@/data/linkedList"
import PriorityQueue from "ts-priority-queue"
import type { Edge, Edges, Node, Nodes } from "v-network-graph"
import { ref } from "vue"

let innerCycle: boolean = false


function getEdge(sourceId: string, targetId: String, nodes: Nodes, edges: Edges){
    for (const key in edges){
        let edge = edges[key]
        if (edge.source == sourceId && edge.target == targetId){
            return edge
        }
    }
}

function getNodeId(node: Node, nodes: Nodes){
    for (const key in nodes){
        if (nodes[key] == node){
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
        
        if (edge == null || edge.weight > 2*(M - vertex.distanceZwick)){
            vertex.isOut = false
        }
    }
    if (!vertex.isOut){
        edge = vertex.req.next()
    }

    vertex.activate = (edge != null)
    if (vertex.activate){
        edge.queueKey = edge.weight + vertex.distanceZwick
        edge.colorZwick = "gray"
        P.queue(edge)
    }
}

function backward(vertex: Node){
    let edge = vertex.in.next()

    if (edge != null){
        edge.queueKey = edge.weight
        edge.colorZwick = "black"
        Q.queue(edge)
    }
}

function request(vertex: Node, successor: Node, nodes: Nodes, edges: Edges){
    let edge = getEdge(getNodeId(vertex, nodes), getNodeId(successor, nodes), nodes, edges)
    vertex.req.insertNode(edge)
    if (vertex.req.isLength1()){
        vertex.req.reset()
    }

    if (vertex.solvedZwick && !vertex.activate){
        forward(vertex)
    } 
}

export function zwick(source: Node, nodes: Nodes, edges: Edges){
    console.log(nodes)
    console.log(edges)
    M = Infinity
    P.clear()
    Q.clear()
    vertexNum = 0
    solvedNum = 0
    for(const key in nodes){
        const vertex = nodes[key]
        vertex.distanceZwick = Infinity
        vertex.prevZwick = null
        vertex.out.reset()
        vertex.in.reset()
        vertex.colorZwick = "blue"
        vertex.solvedZwick = false
        vertex.isOut = true
        vertex.activate = false
        vertex.req = new SortedLinkedList<Node>(compareFunc)
        vertexNum++
    }

    source.distanceZwick = 0
    source.solvedZwick = true
    forward(source)

    while (solvedNum != vertexNum && P.length > 0){

        let edge = P.dequeue()
        let vertex = nodes[edge.source]
        let successor = nodes[edge.target]
        forward(vertex)

        if (!successor.solvedZwick){
            successor.distanceZwick = vertex.distanceZwick + edge.weight
            successor.prevZwick = vertex
            solvedNum++
            successor.solvedZwick = true
            forward(successor)

            if (solvedNum == Math.ceil(vertexNum / 2)){
                M = successor.distanceZwick
                for (const key in nodes){
                    let notSolvedVertex = nodes[key]

                    if (!notSolvedVertex.solvedZwick){
                        backward(notSolvedVertex)
                    }
                }
            }
        }

        while (Q.length > 0 && Q.peek().queueKey < 2 * ((P.length > 0 ? P.peek().queueKey : Infinity) - M)){
            let edge = Q.dequeue()
            let vertex = nodes[edge.source]
            let successor = nodes[edge.target]

            if (!successor.solvedZwick){
                backward(successor)
                request(vertex, successor, nodes, edges)
            }
        }
    }
}

export function oneStepZwick(step: number, source: Node, nodes: Nodes, edges: Edges){
    console.log(P)
    console.log(Q)
    if (step == 0){
        innerCycle = false
        lastEdgesGreen.value = []
        lastEdgesBlue.value = []
        lastNodeGreen.value = {}
        lastNodeBlue.value = {}
        vertexNum = 0
        solvedNum = 0
        P.clear()
        Q.clear()
        M = Infinity
        for(const key in nodes){
            const vertex = nodes[key]
            vertex.distanceZwick = Infinity
            vertex.prevZwick = null
            vertex.out.reset()
            vertex.in.reset()
            vertex.req = new SortedLinkedList<Node>(compareFunc)
            vertex.colorZwick = "blue"
            vertex.solvedZwick = false
            vertex.isOut = true
            vertex.activate = false
            vertexNum++
        }
        for (const key in edges){
            edges[key].colorZwick = "blue"
        }
        source.distanceZwick = 0
        source.solvedZwick = true
        forward(source)
        return false
    }
    lastNodeBlue.value.colorZwick = "blue"
    lastNodeBlue.value = {}
    lastNodeGreen.value.colorZwick = "green"
    for (const key in lastEdgesGreen.value){
        lastEdgesGreen.value[key].colorZwick = "green";
        delete lastEdgesGreen.value[key]
    }

    if (!innerCycle){
        if (solvedNum != vertexNum && P.length > 0){

            let edge = P.dequeue()
            lastEdgesGreen.value.push(edge)
            edge.colorZwick = "red"
            let vertex = nodes[edge.source]
            vertex.colorZwick = "green"
            let successor = nodes[edge.target]
            successor.colorZwick = "red"
            lastNodeGreen.value = successor
            forward(vertex)

            if (!successor.solvedZwick){
                successor.distanceZwick = vertex.distanceZwick + edge.weight
                successor.prevZwick = vertex
                solvedNum++
                successor.solvedZwick = true
                forward(successor)

                if (solvedNum == Math.ceil(vertexNum / 2)){
                    M = successor.distanceZwick
                    console.log(M)
                    for (const key in nodes){
                        let notSolvedVertex = nodes[key]

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
        edge.colorZwick = "magenta"
        lastEdgesBlue.value.push(edge)
        let vertex = nodes[edge.source]
        //vertex.colorZwick = "green"
        let successor = nodes[edge.target]
        successor.colorZwick = "magenta"
        if (successor.solvedZwick){
            lastNodeGreen.value = successor
            lastEdgesGreen.value.push(edge)
        }
        else {
            lastEdgesBlue.value.push(edge)
            lastNodeBlue.value = successor
        }
        if (!successor.solvedZwick){
            backward(successor)
            request(vertex, successor, nodes, edges)
        }
    }
    return (Q.length > 0 && Q.peek().queueKey < 2 * ((P.length > 0 ? P.peek().queueKey : Infinity) - M))
}
