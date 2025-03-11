import type { Edges, Nodes, Node } from "v-network-graph"
import type { Ref } from "vue"

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

export function forwardStepAlgorithm(algorithm: Function, step: number, 
                                     startingNodeName: Ref<string>,
                                     nodes: Nodes, edges: Edges){
    console.log("pri algoritme", step)
    if (step == 0){
        startingNode = findNodeByName(nodes, startingNodeName.value)
    }
    algorithm(step, startingNode, nodes, edges);
    updateNodes(nodes);
    updateEdges(edges);
    console.log("po algoritme", step)
    console.log(step)
    return step + 1;
}

function findNodeByName(nodes: Nodes, name: string){
    for(const key in nodes){
        if (nodes[key].name == name){
            return nodes[key]
        }
    }
    return {}
}