import { type Nodes, type Edges, type Layouts, defineConfigs } from "v-network-graph"

const nodes: Nodes = {
  node1: { name: "N1", distance: 0, solved: false, prev: null },
  node2: { name: "N2", distance: 0, solved: false, prev: null },
  node3: { name: "N3", distance: 0, solved: false, prev: null },
}

const edges: Edges = {
  edge1: { source: "node1", target: "node2", weight: 42 },
  edge2: { source: "node2", target: "node3", weight: 69 },
}

const layouts: Layouts = {
  nodes: {
    node1: { x: 50, y: 0 },
    node2: { x: 0, y: 75 },
    node3: { x: 100, y: 75 },
  },
}

const configs = defineConfigs({
  node: {
    selectable: 2, // up to 2 nodes
  },
  edge: {
    selectable: true,
    normal: {
      width: 3,
    },
  },
})

export default {
  nodes,
  edges,
  layouts,
  configs,
}