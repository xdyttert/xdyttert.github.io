import { SortedLinkedList } from "@/data/linkedList";
import { compareFunc, type Edge, type Edges, type Node, type Nodes } from "./startingGraph";
import type { EdgeConfig, Layouts } from "v-network-graph";
import { getEdge } from "../utils/utils";

const exampleLayouts: Layouts = {
  nodes: {
    node1: { x: 10, y: 10 },
    node2: { x: 120, y: 10 },
    node3: { x: 230, y: 10 },
    node4: { x: 270, y: 120 },
    node5: { x: 170, y: -100 },
    node6: { x: 300, y: -100 },
    node7: { x: 340, y: 10 },
    node8: { x: 450, y: 120 },
    node9: { x: 560, y: 10 },
  },
}

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

 export function randomGraph(nodes: Nodes, edges: Edges, layouts: Layouts) {
    for (const key in nodes){
        delete nodes[key]
        delete layouts.nodes[key]
    }

    for (const key in edges){
        delete edges[key]
    }

    let nodeNum: number = getRandomInt(5, 9)

    for (let i = 1; i <= nodeNum; i++){
        const key: string = "node" + String(i)
        nodes[key] = { name: "N" + String(i), distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) }
        layouts.nodes[key] = exampleLayouts.nodes[key]
    }

    let j = 1
    let cap = getRandomInt((nodeNum * (nodeNum - 1)) / 10, (nodeNum * (nodeNum - 1)) / 2)
    for (let i = 1; i <= cap; i++){
        let key: string = "edge" + String(j)
        let firstNode: number = getRandomInt(1, nodeNum)
        let secondNode: number = getRandomInt(1, nodeNum)
        if (firstNode == secondNode){ continue }

        let firstNodeID: string = "node" + String(firstNode)
        let secondNodeID: string = "node" + String(secondNode)
        console.log(firstNodeID, secondNodeID)

        if (getEdge(firstNodeID, secondNodeID, edges) != null) { continue }

        let newWeight = getRandomInt(1, 10)
        edges[key] = { source: firstNodeID, target: secondNodeID, weight: newWeight, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", PKeySpira: 0, PKeyZwick: 0, isInPSpira: false, isInQZwick: false, isInPZwick: false, inPertinent: false, outPertinent: false }
        j++
    }
 }