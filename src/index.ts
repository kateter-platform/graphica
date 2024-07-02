// export { default as Core } from "./Core";
// export { default as Arc } from "./Components/Arc";
// export { default as Bracket } from "./Components/Bracket";
// export { default as Button } from "./Components/Button";
// export { default as Circle } from "./Components/Circle";
// export { default as Grid } from "./Components/Grid";
// export { default as InfiniteLine } from "./Components/InfiniteLine";
// export { default as InputField } from "./Components/InputField";
// export { default as Label } from "./Components/Label";
// export { default as Latex } from "./Components/Latex";
// export { default as Line } from "./Components/Line";
// export { default as Plot } from "./Components/Plot";
// export { default as Point } from "./Components/Point";
// export { default as Polygon } from "./Components/Shape";
// export { default as Slider } from "./Components/Slider";
// export { default as Text } from "./Components/Text";
// export { default as Vector } from "./Components/Vector";
// export { default as Fraction } from "./Components/Derived/Fraction";
// export { default as SVGLoader } from "./Components/SVGLoader";
// export * as three from "three";

import { Shape, Vector2 } from "three";
import Arc from "./Components/Arc";
import Circle from "./Components/Circle";
import Grid from "./Components/Grid";
import LegendBox from "./Components/LegendBox";
import Plot from "./Components/Plot";
import Point from "./Components/Point";
import Core from "./Core";

const grid = new Grid();
const plot1 = new Plot("x^2");
const plot2 = new Plot("x^3");
const plot3 = new Plot("x^4");
const plot4 = new Plot("-3x+5");
// const plot5 = new Plot("e^x + 2x + log(x)");
// const plot6 = new Plot("x^2 + 2x + 1");
// const plot7 = new Plot("x+1");
// const plot8 = new Plot("2x+1");
// const plot9 = new Plot("-4x-1");
const point1 = new Point(4, 2, { draggable: "unrestricted", color: "#AA74B8" });
const point2 = new Point(3, 5);
const circle1 = new Circle(0, 0, 2, { color: 0xaa74b8, segments: 32 });
const arc1 = new Arc([6, 2], [8, 5], [6, 6]);

const core = new Core();
const legend = new LegendBox([plot1, plot2]);
core.add(grid);
core.add(plot1);
core.add(plot2);
core.add(plot3);
core.add(plot4);
core.add(point1);
core.add(point2);
core.add(circle1);
core.add(arc1);

legend.addElement(plot3);
legend.addElement(plot4);
legend.addElement(point1);
legend.addElement(point2);
legend.addElement(circle1);
legend.addElement(arc1);

core.addGui(legend); //must be added after plots
core.run();

// core.run((t) => {
//   plot1.setExpression(`x^2+${(t / 10).toFixed(2)}`);
// });
