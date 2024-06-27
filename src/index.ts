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


const core = new Core();
const grid = new Grid();
const node = new Node(-4,10,5,[],{label: "Node 1"});
const node2 = new Node(7,-20,5,[],{label: "Node 2"}));
const node3 = new Node(20,0,5,[],{label: "Node 3"});
node.connectTo(node2);
node2.connectTo(node);
node2.connectTo(node3);
core.add(grid);
core.add(node);
core.add(node2);
core.add(node3);

core.run();
