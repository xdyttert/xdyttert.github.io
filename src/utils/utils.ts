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

export function forwardStepAlgorithm(algorithm: Function, step: Ref<number>, 
                                     startingNodeName: Ref<string>,
                                     nodes: Nodes, edges: Edges){
    if (step.value == 0){
        startingNode = findNodeByName(nodes, startingNodeName.value)
    }
    console.log(step.value)
    algorithm(step.value, startingNode, nodes, edges);
    updateNodes(nodes);
    updateEdges(edges);
    step.value++;
}

function findNodeByName(nodes: Nodes, name: string){
    for(const key in nodes){
        if (nodes[key].name == name){
            return nodes[key]
        }
    }
    return {}
}