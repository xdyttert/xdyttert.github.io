import { Edge, makeEdgesLists, Node, Nodes } from "../data/graph";
import { dijkstra } from "../algorithms/tests/dijkstra";
import { nodes, edges } from "../data/graph"

makeEdgesLists()
dijkstra(nodes["node1"], nodes)

test("distance N1", () => {
    expect(nodes["node1"].d).toBe(0);
})