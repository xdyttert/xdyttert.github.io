import { SortedLinkedList } from "@/data/linkedList";
import { compareFunc, type Edge, type Edges, type Node, type Nodes } from "../data/startingGraph";

let arbitraryNode: Node = {
    name: "",
    distanceDijkstra: 0,
    distanceSpira: 0,
    distanceZwick: 0,
    isInQDijkstra: false,
    exploredBFS: false,
    solvedDijkstra: false,
    solvedSpira: false,
    solvedZwick: false,
    prevDijkstra: null,
    prevSpira: null,
    prevZwick: null,
    colorDijkstra: "",
    colorSpira: "",
    colorZwick: "",
    isOut: false,
    active: false,
    outDijkstra: [],
    outSpira: new SortedLinkedList<Edge>(compareFunc),
    outZwick: new SortedLinkedList<Edge>(compareFunc),
    in: new SortedLinkedList<Edge>(compareFunc),
    req: new SortedLinkedList<Edge>(compareFunc)
}

const arbitraryEdgeWithNullSource: Edge = { 
    source: "null", 
    target: "node2", 
    weight: 5, 
    colorDijkstra: "blue", 
    colorSpira: "blue", 
    colorZwick: "blue", 
    PKeySpira: 0,
    PKeyZwick: 0, 
    isInPSpira: false, 
    isInQZwick: false, 
    isInPZwick: false, 
    inPertinent: false, 
    outPertinent: false 
}

export function updateNodes(nodes: Nodes){
    for(const key in nodes){
        nodes[key] = nodes[key]
    }
}

export function updateEdges(edges: Edges){
    for(const key in edges){
        edges[key] = edges[key]
    }
}

export function getEdge(sourceId: string, targetId: String, edges: Edges): Edge | null {
    for (const key in edges){
        let edge = edges[key]
        if (edge.source == sourceId && edge.target == targetId){
            return edge
        }
    }
    return null
}

export function getNodeId(node: Node, nodes: Nodes){
    for (const key in nodes){
        if (nodes[key] == node){
            return key
        }
    }
    return ""
}

export function findNodeByName(nodes: Nodes, name: string){
    for(const key in nodes){
        if (nodes[key].name == name){
            return nodes[key]
        }
    }
    return arbitraryNode
}

export function shortestPathsTree(nodes: Nodes, edges: Edges, prev: keyof Node, color: keyof Edge){
    for(const key in nodes){
        let u = nodes[key]
        let treeEdge: Edge = getEdge(getNodeId(u[prev] as Node, nodes), getNodeId(u, nodes), edges)!;
        (treeEdge as any)[color] = "brown"
    }
    console.log(edges)
    updateEdges(edges)
}

export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
