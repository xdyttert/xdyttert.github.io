import data, { compareFunc } from "@/data/startingGraph"
import { SortedLinkedList } from "@/data/linkedList"
import PriorityQueue from "ts-priority-queue"
import type { Edge, Edges, Node, Nodes } from "v-network-graph"
import { ref, type Ref } from "vue"
import { fa, tr } from "element-plus/es/locales.mjs"
import { getEdge, getNodeId } from "@/utils/utils"
import { bfs } from "./bfs"

let innerCycle: boolean = false

const P = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.PKeyZwick - edge2.PKeyZwick})
const Q = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.weight - edge2.weight})
let solvedNum = 0
let vertexNum = 0
let M: number = Infinity
const lastNodeGreen: Node = ref({})
const lastNodeBlue: Node = ref({})
const lastEdgesGreen = ref<Edge[]>([])
const lastEdgesBlue = ref<Edge[]>([])

function min(P: PriorityQueue<Edge>){
    if (P.length == 0){ return Infinity }
    return P.peek().PKeyZwick
}

function forward(u: Node){
    let edge = null
    if (u.isOut){
        edge = u.outZwick.next()
        
        if (edge == null || edge.weight > 2*(M - u.distanceZwick)){
            u.isOut = false
        }
        
        else { edge.outPertinent = true }
    }
    if (!u.isOut){
        edge = u.req.next()
    }

    u.active = (edge != null)
    if (u.active){
        edge.PKeyZwick = edge.weight + u.distanceZwick
        edge.colorZwick = "gray"
        P.queue(edge)
        edge.isInPZwick = true
    }
}

function backward(u: Node){
    let edge = u.in.next()

    if (edge != null){
        edge.QKeyZwick = edge.weight
        // edge.colorZwick = "black"
        Q.queue(edge)
        edge.isInQZwick = true
    }
}

function request(u: Node, v: Node, nodes: Nodes, edges: Edges){
    let edge = getEdge(getNodeId(u, nodes), getNodeId(v, nodes), edges)
    edge.inPertinent = true
    edge.colorZwick = "yellow"
    u.req.insertNodeReq(edge)
    if (u.solvedZwick && !u.active){
        forward(u)
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
        vertex.outZwick.reset()
        vertex.in.reset()
        vertex.colorZwick = "blue"
        vertex.solvedZwick = false
        vertex.isOut = true
        vertex.active = false
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

        while (Q.length > 0 && Q.peek().weight < 2 * (min(P) - M)){
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

export function initialization(nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){
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
        const u = nodes[key]
        u.distanceZwick = Infinity
        u.prevZwick = null
        u.outZwick.reset()
        u.in.reset()
        u.req = new SortedLinkedList<Edge>(compareFunc)
        u.colorZwick = "blue"
        u.solvedZwick = false
        u.isOut = true
        u.active = false
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
    edge.colorZwick = "red"
    v.colorZwick = "red"
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

    // if (P.length == 0) {return -1}

    if (!(Q.length > 0 && Q.peek().weight < 2 * (min(P) - M))){
        if (solvedNum != vertexNum && P.length > 0){
            let edge = P.dequeue()
            edge.isInPZwick = false
            lastEdgesGreen.value.push(edge)
            edge.colorZwick = "orange"
            let u = nodes[edge.source]
            u.colorZwick = "green"
            let v = nodes[edge.target]
            v.colorZwick = "orange"
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
        return
    }
    if ((Q.length > 0 && Q.peek().weight < 2 * (min(P) - M))){
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
            backward(v)
            request(u, v, nodes, edges)
        }
        return
    }
}

export function* Zwick(source: Node, nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>){
    source.distanceZwick = 0
    source.solvedZwick = true
    source.colorZwick = "green"
    vertexNum = bfs(source, nodes, edges)
    forward(source)
    yield

    while (solvedNum != vertexNum && P.length > 0){
        let edge = P.dequeue()
        edge.isInPZwick = false
        
        lastEdgesGreen.value.push(edge)
        edge.colorZwick = "orange"
        let u = nodes[edge.source]
        let v = nodes[edge.target]
        v.colorZwick = "orange"
        lastNodeGreen.value = v
        forward(u)

        if (!v.solvedZwick){
            relax(u, v, edge, numOfRelaxededges)

            if (solvedNum == Math.ceil(vertexNum / 2)){
                M = v.distanceZwick
                for (const key in nodes){
                    let w = nodes[key]

                    if (!w.solvedZwick){
                        backward(w)
                    }
                }
            }
        }
        yield
        
        edge.colorZwick = "green"
        v.colorZwick = "green"

        while ((Q.length > 0 && Q.peek().weight < 2 * (min(P) - M))){
            let edge = Q.dequeue()
            edge.isInQZwick = false
            let lastColor = edge.colorZwick
            edge.colorZwick = "magenta"
            
            let u = nodes[edge.source]
            let v = nodes[edge.target]

            if (!v.solvedZwick){
                backward(v)
                request(u, v, nodes, edges)
            }
            yield
            if (!(edge.colorZwick == "gray")) { edge.colorZwick = lastColor }
        }   
    }
}
