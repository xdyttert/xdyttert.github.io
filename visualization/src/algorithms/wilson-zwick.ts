import { SortedLinkedList } from "@/data/linkedList"
import { compareFunc } from "@/data/startingGraph"
import PriorityQueue from "ts-priority-queue"
import { type Ref } from "vue"
import { type Edge, type Edges, type Node, type Nodes } from "../data/startingGraph"
import { ZwickConstants, showPertinent } from "../utils/store"
import { bfs } from "./bfs"

const P = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.PKeyZwick - edge2.PKeyZwick})
const Q = new PriorityQueue({comparator: (edge1: Edge, edge2: Edge) => edge1.weight - edge2.weight})
let solvedNum = 0
let vertexNum = 0

function min(P: PriorityQueue<Edge>){
    if (P.length == 0){ return Infinity }
    return P.peek().PKeyZwick
}

function forward(u: Node){
    let edge = null
    if (u.isOut){
        edge = u.outZwick.next()
        
        if (edge == null || edge.weight > 2*(ZwickConstants.M - u.distanceZwick)){
            u.isOut = false
        }
        
        else { edge.outPertinent = true }
    }
    if (!u.isOut){
        edge = u.req.next()
    }

    u.active = (edge != null)
    if ((edge != null)){ // u.active
        edge.PKeyZwick = edge.weight + u.distanceZwick
        edge.colorZwick = "gray"
        P.queue(edge)
        edge.isInPZwick = true
    }
}

function backward(u: Node){
    let edge = u.in.next()

    if (edge != null){
        Q.queue(edge)
        edge.isInQZwick = true
    }
}

function request(u: Node, edge: Edge){
    edge.inPertinent = true
    edge.colorZwick = "purple"
    u.req.insertNode(edge)
    if (u.solvedZwick && !u.active){
        forward(u)
    } 
}

export function initialization(nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>, numOfScannedEdges: Ref<number>){
    numOfRelaxededges.value = 0
    numOfScannedEdges.value = 0
    vertexNum = 0
    solvedNum = 0
    P.clear()
    Q.clear()
    ZwickConstants.M = Infinity
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

export function* Zwick(source: Node, nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>, numOfScannedEdges: Ref<number>){
    source.distanceZwick = 0
    source.solvedZwick = true
    solvedNum++
    source.colorZwick = "green"
    vertexNum = bfs(source, nodes, edges)
    forward(source)
    yield

    while (solvedNum != vertexNum && P.length > 0){
        let edge = P.dequeue()
        edge.isInPZwick = false
        numOfScannedEdges.value++

        let u = nodes[edge.source]
        let v = nodes[edge.target]
        edge.colorZwick = "orange"
        forward(u)

        if (!v.solvedZwick){
            relax(u, v, edge, numOfRelaxededges)

            if (solvedNum == Math.ceil(vertexNum / 2)){
                ZwickConstants.M = v.distanceZwick
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

        while ((Q.length > 0 && Q.peek().weight < 2 * (min(P) - ZwickConstants.M))){
            let edge = Q.dequeue()
            edge.isInQZwick = false
            let lastColor = edge.colorZwick
            edge.colorZwick = "yellow" // FI yellow color
            
            let u = nodes[edge.source]
            let v = nodes[edge.target]

            if (!v.solvedZwick){
                backward(v)
                request(u, edge)
            }
            if (showPertinent.innerCycle) { yield }

            if (!(edge.colorZwick == "gray")) { edge.colorZwick = lastColor }
        }   
    }
}
