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
const plot4 = new Plot("x^5");
const plot5 = new Plot("e^x + 2x + log(x)");
const plot6 = new Plot("x^2 + 2x + 1");
const plot7 = new Plot("x+1");
const plot8 = new Plot("2x+1");
const plot9 = new Plot("-4x-1");
const point1 = new Point(0, 0, { draggable: "unrestricted" });
const point2 = new Point(3, 5);
const circle1 = new Circle(0, 0, 3);

const core = new Core();
const legend = new LegendBox([plot1, plot2]); // Fix: Pass an array of plots as a single argument
core.add(grid);
core.add(plot1);
core.add(plot2);
core.add(plot3);
core.add(point1);
core.add(point2);
core.add(circle1);

legend.addElement(plot3);
legend.addElement(point1);
legend.addElement(point2);
legend.addElement(circle1);

core.addGui(legend); //must be added after plots
core.run();

// core.run((t) => {
//   plot1.setExpression(`x^2+${(t / 10).toFixed(2)}`);
// });
