// export { default as Graphica } from "./Graphica";
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

import Arc from "./Components/Arc";
import Line from "./Components/Line";
import Point from "./Components/Point";
import Polygon from "./Components/Shape";
import Graphica from "./Graphica";

const g = new Graphica();

const a = new Point(0, 0);
const b = new Point(3, 0);
const c = new Point(0, 2, { draggable: "unrestricted", label: true });

const arc = new Arc(b, a, c, 5);

g.add(a);
g.add(b);
g.add(c);
g.add(arc);
g.run();
