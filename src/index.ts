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

import Grid from "./Components/Grid";
import Core from "./Core";
import Node from "./Components/Derived/Node"
import Line from "./Components/Line";
import { disconnect } from "process";
import Arc from "./Components/Arc";
import THREE, { Curve } from "three";
import Bracket from "./Components/Bracket";
import { falseDependencies } from "mathjs";


const core = new Core();
//const grid = new Grid();
const node = new Node(0,10,5,[],{label: "Node 1"});
const node2 = new Node(0,-20,5,[],{label: "Node 2"}));
const node3 = new Node(20,0,5,[],{label: "Node 3"});
const node4 = new Node(-40,-40,5,[],{label: "Node 4"});
const node5 = new Node(20,-50,5,[],{label: "Node 5"});
node.connectTo(node2, false);
node2.connectTo(node3, false);
node2.connectTo(node4, true);
node5.connectTo(node2, false);
node4.connectTo(node2, true);
//node3.connectTo(node2, true);
//core.add(grid);
core.add(node);
core.add(node2);
core.add(node3);
core.add(node4);
core.add(node5);

core.run();
