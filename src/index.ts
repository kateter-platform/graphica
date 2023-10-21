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
import Grid from "./Components/Grid";
import Label from "./Components/Label";
import Point from "./Components/Point";
import Graphica from "./Graphica";

const a = new Graphica();
const b = new Grid();
const p = new Point(0, 0, { draggable: "unrestricted" });
const pp = new Point(5, 0);
const ppp = new Point(0, 5);
const c = new Arc(p, pp, ppp);
a.add(b);
a.add(c);
a.add(p);
a.add(pp);
a.add(ppp);
a.run();
