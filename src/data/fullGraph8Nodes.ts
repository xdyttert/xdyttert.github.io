import type { Layouts } from "v-network-graph";
import { SortedLinkedList } from "./linkedList";
import { compareFunc, type Edge, type Edges, type Node, type Nodes } from "./startingGraph";

const centerX: number = 300
const centerY: number = 0
const size: number = 200

export const fullGraphNodes: Nodes = {
  node1: { name: "N1", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node2: { name: "N2", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node3: { name: "N3", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node4: { name: "N4", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node5: { name: "N5", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node6: { name: "N6", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node7: { name: "N7", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
  node8: { name: "N8", distanceDijkstra: 0, distanceSpira: 0, distanceZwick: 0, isInQDijkstra: false, exploredBFS: false, solvedDijkstra: false, solvedSpira: false, solvedZwick: false, prevDijkstra: null, prevSpira: null, prevZwick: null, colorDijkstra: "blue", colorSpira: "blue", colorZwick: "blue", isOut: true, active: true, outDijkstra: [], outSpira: new SortedLinkedList<Edge>(compareFunc), outZwick: new SortedLinkedList<Edge>(compareFunc), in: new SortedLinkedList<Edge>(compareFunc), req: new SortedLinkedList<Edge>(compareFunc) },
}


function generateFullGraphEdges(nodes: Nodes): Edges {
    const nodeKeys = Object.keys(nodes);
    const edges: Edges = {};
    let edgeId = 1;
  
    for (let i = 0; i < nodeKeys.length; i++) {
      for (let j = i; j < nodeKeys.length; j++) {
        if (i === j) continue; // skip self-loop
  
        const source = nodeKeys[i];
        const target = nodeKeys[j];
        const edgeKey = `edge${edgeId++}`;
  
        edges[edgeKey] = {
          source,
          target,
          weight: Math.floor(Math.random() * 10) + 1, // random weight from 1 to 10
          colorDijkstra: "blue",
          colorSpira: "blue",
          colorZwick: "blue",
          PKeySpira: 0,
          PKeyZwick: 0,
          isInPSpira: false,
          isInQZwick: false,
          isInPZwick: false,
          inPertinent: false,
          outPertinent: false,
        };
      }
    }
  
    return edges;
  }

export const fullGraphEdges: Edges = generateFullGraphEdges(fullGraphNodes)

export const fullGraphLayouts: Layouts = {
    nodes: {
      node1: { x: centerX + size * Math.cos(0), y: centerY + size * Math.sin(0) },             // angle 0°
      node2: { x: centerX + size * Math.cos(Math.PI / 4), y: centerY + size * Math.sin(Math.PI / 4) }, // 45°
      node3: { x: centerX + size * Math.cos(Math.PI / 2), y: centerY + size * Math.sin(Math.PI / 2) }, // 90°
      node4: { x: centerX + size * Math.cos((3 * Math.PI) / 4), y: centerY + size * Math.sin((3 * Math.PI) / 4) }, // 135°
      node5: { x: centerX + size * Math.cos(Math.PI), y: centerY + size * Math.sin(Math.PI) }, // 180°
      node6: { x: centerX + size * Math.cos((5 * Math.PI) / 4), y: centerY + size * Math.sin((5 * Math.PI) / 4) }, // 225°
      node7: { x: centerX + size * Math.cos((3 * Math.PI) / 2), y: centerY + size * Math.sin((3 * Math.PI) / 2) }, // 270°
      node8: { x: centerX + size * Math.cos((7 * Math.PI) / 4), y: centerY + size * Math.sin((7 * Math.PI) / 4) }, // 315°
    },
  };
  