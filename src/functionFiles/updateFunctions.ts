import type { Edge, Edges, Nodes } from "v-network-graph"


export function updateNodes(nodes: Nodes, dataNodes: Nodes){
    for(const key in dataNodes){
    delete nodes[key]
    nodes[key] = dataNodes[key]
    }
}

export function updateEdges(edges: Edges, dataEdges: Edges){
    for(const key in dataEdges){
    delete edges[key]
    edges[key] = dataEdges[key]
    }
}