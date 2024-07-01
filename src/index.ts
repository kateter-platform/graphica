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
export * as three from "three"; */

import Core from "./Core";
import Node from "./Components/Derived/Node"
import OperationButtonPanel from "./Components/Derived/OperationButtonPanel";


const core = new Core();
//const grid = new Grid();
const node = new Node(-20,20,5,[],{label: "Node 123456789"});
const node2 = new Node(0,-20,5,[],{label: "Node 2 Mer tekst"});
const node3 = new Node(40,20,5,[],{label: "3"});
const node4 = new Node(30,-40,5,[],{label: "4"});
const node5 = new Node(-50,20,5,[]);
node.connectTo(node2, false, 10);
node2.connectTo(node3, true, 5);
node2.connectTo(node4, true, 5);
node4.connectTo(node2, true, 20);
node.connectTo(node5, true);
core.add(node);
core.add(node2);
core.add(node3);
core.add(node4);
core.add(node5);

const op1 = () => {
    node.setColor(0xff0000);
}
const op2 = () => {
    node2.setEdgeColor(node3, 0xff0000);
}
const op3 = () => {
    node3.setColor(0xff0000);
}

const op12 = () => {
    node.setColor(0xfaa307);
}
const op22 = () => {
    node2.setEdgeColor(node3, 0x000000);
}
const op32 = () => {
    node3.setColor(0xfaa307);
}
const lst = [op1, op2, op3];
const lst2 = [op12, op22, op32];

const operationButtonPanel = new OperationButtonPanel(lst, lst2);

core.addGui(operationButtonPanel);

core.run();
