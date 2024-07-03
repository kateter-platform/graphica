/* export { default as Core } from "./Core";
export { default as Arc } from "./Components/Arc";
export { default as Bracket } from "./Components/Bracket";
export { default as Button } from "./Components/Button";
export { default as Circle } from "./Components/Circle";
export { default as Grid } from "./Components/Grid";
export { default as InfiniteLine } from "./Components/InfiniteLine";
export { default as InputField } from "./Components/InputField";
export { default as Label } from "./Components/Label";
export { default as Latex } from "./Components/Latex";
export { default as Line } from "./Components/Line";
export { default as Plot } from "./Components/Plot";
export { default as Point } from "./Components/Point";
export { default as Polygon } from "./Components/Shape";
export { default as Slider } from "./Components/Slider";
export { default as Text } from "./Components/Text";
export { default as Vector } from "./Components/Vector";
export { default as Fraction } from "./Components/Derived/Fraction";
export { default as SVGLoader } from "./Components/SVGLoader";
export { default as Node } from "./Components/Derived/Node";
export { default as OperationButtonPanel } from "./Components/Derived/OperationButtonPanel";
export * as three from "three"; */

import Node from "./Components/Derived/Node";
import OperationButtonPanel from "./Components/Derived/OperationButtonPanel";
import Grid from "./Components/Grid";
import Core from "./Core";

const graphica = new Core();
const grid = new Grid();

// Create nodes
// First two parameters decide node position
// Third parameter decides node radius
// Fourth parameter is an optional adjacency list
// Fifth parameter contains optional paramaters, like label, color and segemnts
const node1 = new Node(-5, 0, 1, [], { label: "Node 1" });
const node2 = new Node(0, 5, 1, [], { label: "Node 2" });
const node3 = new Node(5, 5, 1, [], { label: "Node 3" });
const node4 = new Node(0, -5, 1, [], { label: "Node 4" });
const node5 = new Node(5, -2, 1, [], { label: "Node 5" });
const node6 = new Node(5, -8, 1, [], { label: "Node 6" });

// Connect nodes with edges
// First parameter decides which node to connect to with an edge
// Second parameter (optional) decides whether edge is directed or not (default false)
// Third parameter (optional) gives the edge a weight/value
node1.connectTo(node2, false);
node1.connectTo(node4, false);
node2.connectTo(node3, false);
node4.connectTo(node5, false);
node4.connectTo(node6, false);

// Add nodes to the graphica instance
graphica.add(node1);
graphica.add(node2);
graphica.add(node3);
graphica.add(node4);
graphica.add(node5);
graphica.add(node6);
graphica.add(grid);

// Define the BFS traversal steps
// type decides the node operation and can be "setColor" | "setEdgeColor" | "setEdgeWeight" | "addEdgeWeight"
// args specifies arguments for the operation given in type
const steps = [
    { type: "setColor", args: [node1, 0xaaaaaa] },
    { type: "setEdgeColor", args: [node1, node2, 0xfaa307] },
    { type: "setColor", args: [node2, 0xaaaaaa] },
    { type: "setEdgeColor", args: [node1, node4, 0xfaa307] },
    { type: "setColor", args: [node4, 0xaaaaaa] },
    { type: "setColor", args: [node1, 0x000000] },
    { type: "setEdgeColor", args: [node2, node3, 0xfaa307] },
    { type: "setColor", args: [node3, 0xaaaaaa] },
    { type: "setColor", args: [node2, 0x000000] },
    { type: "setEdgeColor", args: [node4, node5, 0xfaa307] },
    { type: "setColor", args: [node5, 0xaaaaaa] },
    { type: "setEdgeColor", args: [node4, node6, 0xfaa307] },
    { type: "setColor", args: [node6, 0xaaaaaa] },
    { type: "setColor", args: [node4, 0x000000] },
    { type: "setColor", args: [node3, 0x000000] },
    { type: "setColor", args: [node5, 0x000000] },
    { type: "setColor", args: [node6, 0x000000] },
];

// Create an OperationButtonPanel to step through the BFS traversal steps
const operationButtonPanel = new OperationButtonPanel(steps);
graphica.addGui(operationButtonPanel);

// Run the graphica instance
graphica.run();