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
export { default as LegendText } from "./Components/LegendText";
export { default as LegendBox } from "./Components/LegendBox";
export { default as Line } from "./Components/Line";
export { default as Plot } from "./Components/Plot";
export { default as Point } from "./Components/Point";
export { default as Polygon } from "./Components/Shape";
export { default as Slider } from "./Components/Slider";
export { default as State } from "./Components/State";
export { default as Text } from "./Components/Text";
export { default as Vector } from "./Components/Vector";
export { default as Fraction } from "./Components/Derived/Fraction";
export { default as SVGLoader } from "./Components/SVGLoader";
export { default as Node } from "./Components/Derived/Node";
export { default as OperationButtonPanel } from "./Components/Derived/OperationButtonPanel";
export { default as BarDiagram } from "./Components/Derived/BarDiagram";
export * as three from "three";
 */

import Grid from "./Components/Grid";
import Core from "./Core";

const a = new Core({disableZoom: true, disablePan: true});
const g = new Grid();

a.add(g)

a.run()