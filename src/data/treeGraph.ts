import type { Layouts } from "v-network-graph";
import { SortedLinkedList } from "./linkedList";
import { compareFunc, type Edge, type Edges, type Node, type Nodes } from "./startingGraph";
import { getRandomInt } from "./randomGraph";
export const binaryTreeNodes: Nodes = {};
for (let i = 1; i <= 15; i++) {
  binaryTreeNodes[`node${i}`] = {
    name: `N${i}`,
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
    colorDijkstra: "blue",
    colorSpira: "blue",
    colorZwick: "blue",
    isOut: true,
    active: true,
    outDijkstra: [],
    outSpira: new SortedLinkedList<Edge>(compareFunc),
    outZwick: new SortedLinkedList<Edge>(compareFunc),
    in: new SortedLinkedList<Edge>(compareFunc),
    req: new SortedLinkedList<Edge>(compareFunc)
  };
}

export const binaryTreeEdges: Edges = {};
let edgeId = 1;

for (let i = 1; i <= 7; i++) {
  const left = 2 * i;
  const right = 2 * i + 1;

  if (left <= 15) {
    binaryTreeEdges[`edge${edgeId++}`] = {
      source: `node${i}`,
      target: `node${left}`,
      weight: getRandomInt(0, 10),
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

  if (right <= 15) {
    binaryTreeEdges[`edge${edgeId++}`] = {
      source: `node${i}`,
      target: `node${right}`,
      weight: getRandomInt(0, 10),
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

const startY: number = -250
const startX: number = 275
const diffY: number = 125
const diffX: number = 150

export const binaryTreeLayouts: Layouts = {
  nodes: {
    node1:  { x: startX, y: startY },                                             // Level 0 (root)
    
    node2:  { x: startX - diffX, y: startY + diffY },                             // Level 1
    node3:  { x: startX + diffX, y: startY + diffY },

    node4:  { x: startX - (3 / 2) * diffX, y: startY + 2 * diffY },               // Level 2
    node5:  { x: startX - (1 / 2) * diffX, y: startY + 2 * diffY },
    node6:  { x: startX + (1 / 2) * diffX, y: startY + 2 * diffY },
    node7:  { x: startX + (3 / 2) * diffX, y: startY + 2 * diffY },

    node8:  { x: startX - (7 / 2) * diffX / 2, y: startY + 3 * diffY },           // Level 3
    node9:  { x: startX - (5 / 2) * diffX / 2, y: startY + 3 * diffY },
    node10: { x: startX - (3 / 2) * diffX / 2, y: startY + 3 * diffY },
    node11: { x: startX - (1 / 2) * diffX / 2, y: startY + 3 * diffY },
    node12: { x: startX + (1 / 2) * diffX / 2, y: startY + 3 * diffY },
    node13: { x: startX + (3 / 2) * diffX / 2, y: startY + 3 * diffY },
    node14: { x: startX + (5 / 2) * diffX / 2, y: startY + 3 * diffY },
    node15: { x: startX + (7 / 2) * diffX / 2, y: startY + 3 * diffY },
  },
};
 
