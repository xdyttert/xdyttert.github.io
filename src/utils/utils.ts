import type { Edge, Edges, Nodes, Node } from "v-network-graph"
import { ref, type Ref } from "vue"

let startingNode: Node = {}

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

export function getEdge(sourceId: string, targetId: String, edges: Edges){
    for (const key in edges){
        let edge = edges[key]
        if (edge.source == sourceId && edge.target == targetId){
            return edge
        }
    }
    return { source: "null", target: "null", weight: 5, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", queueKey: 0, isInQDijkstra: false, isInPDijkstra: false, isInQSpira: false, isInPSpira: false, isInQZwick: false, isInPZwick: false }
}

export function getNodeId(node: Node, nodes: Nodes){
    for (const key in nodes){
        if (nodes[key] == node){
            return key
        }
    }
    return ""
}

export function forwardStepAlgorithm(algorithm: Function, step: number, 
                                     startingNodeName: Ref<string>,
                                     nodes: Nodes, edges: Edges, numOfRelaxededges: Ref<number>): [number, number]{
    if (step == 0 || step == 1){
        startingNode = findNodeByName(nodes, startingNodeName.value)
    }
    if (algorithm(step, startingNode, nodes, edges, numOfRelaxededges) == -1) {step = -2}
    updateNodes(nodes);
    updateEdges(edges);
    return [step + 1, numOfRelaxededges.value];
}

export function findNodeByName(nodes: Nodes, name: string){
    for(const key in nodes){
        if (nodes[key].name == name){
            return nodes[key]
        }
    }
    return {}
}

export function shortestPathsTree(nodes: Nodes, edges: Edges, prev: keyof Node, color: keyof Edge){
    for(const key in nodes){
        let u = nodes[key]
        let treeEdge = getEdge(getNodeId(u[prev], nodes), getNodeId(u, nodes), edges)
        treeEdge[color] = "brown"
    }
    console.log(edges)
    updateEdges(edges)
}

export function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
