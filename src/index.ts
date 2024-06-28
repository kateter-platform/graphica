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

import Grid from "./Components/Grid";
import LegendBox from "./Components/LegendBox";
import Plot from "./Components/Plot";
import Core from "./Core";

const grid = new Grid();
const plot1 = new Plot("x^2");
const plot2 = new Plot("x^3");
const plot3 = new Plot("x^4");
const plot4 = new Plot("x^5");
const plot5 = new Plot("e^x + 2x + log(x)", { hideFromLegend: true });
const plot6 = new Plot("x^2 + 2x + 1");

const core = new Core();
const legend = new LegendBox(core);

core.add(grid);
core.add(plot1);
core.add(plot2);
core.add(plot3);
core.add(plot4);
core.add(plot5);
core.add(plot6);

core.addGui(legend); //must be added after plots
core.run();

// core.run((t) => {
//   plot1.setExpression(`x^2+${(t / 10).toFixed(2)}`);
// });
