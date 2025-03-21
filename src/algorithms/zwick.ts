import data, { compareFunc } from "@/data/startingGraph"
import { SortedLinkedList } from "@/data/linkedList"
import PriorityQueue from "ts-priority-queue"
import type { Edge, Edges, Node, Nodes } from "v-network-graph"
import { ref, type Ref } from "vue"
import { fa } from "element-plus/es/locales.mjs"
import { getEdge, getNodeId } from "@/utils/utils"
import { bfs } from "./bfs"

let innerCycle: boolean = false

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
        else {edge.outPertinent = true}
    }
    if (!vertex.isOut){
        edge = vertex.req.next()
    }

    vertex.activate = (edge != null)
    if (vertex.activate){
        edge.queueKey = edge.weight + vertex.distanceZwick
        edge.colorZwick = "gray"
        P.queue(edge)
        edge.isInPZwick = true
    }
}

function backward(vertex: Node){
    let edge = vertex.in.next()

    if (edge != null){
        edge.queueKey = edge.weight
        edge.colorZwick = "orange"
        Q.queue(edge)
        edge.isInQZwick = true
    }
}

function request(vertex: Node, successor: Node, nodes: Nodes, edges: Edges){
    let edge = getEdge(getNodeId(vertex, nodes), getNodeId(successor, nodes), edges)
    vertex.req.insertNode(edge)
    if (vertex.req.isLength1()){
        vertex.req.reset()
    }

    if (vertex.solvedZwick && !vertex.activate){
        forward(vertex)
    } 
}

export function zwick(source: Node, nodes: Nodes, edges: Edges){
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
        vertex.req = new SortedLinkedList<Edge>(compareFunc)
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

function initialization(nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){
    innerCycle = false
    lastEdgesGreen.value = []
    lastEdgesBlue.value = []
    lastNodeGreen.value = {}
    lastNodeBlue.value = {}
    innerCycle = false
    numOfRelaxededges.value = 0
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
        vertex.req = new SortedLinkedList<Edge>(compareFunc)
        vertex.colorZwick = "blue"
        vertex.solvedZwick = false
        vertex.isOut = true
        vertex.activate = false
        vertexNum++
    }
    for (const key in edges){
        let edge = edges[key]
        edge.colorZwick = "blue"
        edge.isInPZwick = false
        edge.isInQZwick = false
        edge.inPertinent = false
        edge.outPertinent = false
    }
}

function relax(u: Node, v: Node, edge: Edge, numOfRelaxededges: Ref<number>){
    v.distanceZwick = u.distanceZwick + edge.weight
    v.prevZwick = u
    solvedNum++
    v.solvedZwick = true
    numOfRelaxededges.value++
    forward(v)
}

export function oneStepZwick(step: number, source: Node, nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){
    if (step == 0){ initialization(nodes, edges, numOfRelaxededges); return }

    if (step == 1) {
        source.distanceZwick = 0
        source.solvedZwick = true
        vertexNum = bfs(source, nodes, edges)
        forward(source)
        return
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
            edge.isInPZwick = false
            lastEdgesGreen.value.push(edge)
            edge.colorZwick = "red"
            let u = nodes[edge.source]
            u.colorZwick = "green"
            let v = nodes[edge.target]
            v.colorZwick = "red"
            lastNodeGreen.value = v
            forward(u)

            if (!v.solvedZwick){
                relax(u, v, edge, numOfRelaxededges)

                if (solvedNum == Math.ceil(vertexNum / 2)){
                    M = v.distanceZwick
                    for (const key in nodes){
                        let w = nodes[key]

                        if (!w.solved){
                            backward(w)
                        }
                    }
                }
            }
        }
        innerCycle = (Q.length > 0 && Q.peek().queueKey < 2 * ((P.length > 0 ? P.peek().queueKey : Infinity) - M))
        return
    }
    if (innerCycle){
        let edge = Q.dequeue()
        edge.colorZwick = "magenta"
        edge.isInQZwick = false
        lastEdgesBlue.value.push(edge)
        let u = nodes[edge.source]
        let v = nodes[edge.target]
        if (v.solvedZwick){
            lastNodeGreen.value = v
            lastEdgesGreen.value.push(edge)
        }
        else {
            lastEdgesBlue.value.push(edge)
            lastNodeBlue.value = v
        }
        if (!v.solvedZwick){
            edge.inPertinent = true
            backward(v)
            request(u, v, nodes, edges)
        }
    }
    innerCycle = (Q.length > 0 && Q.peek().queueKey < 2 * ((P.length > 0 ? P.peek().queueKey : Infinity) - M))
}
