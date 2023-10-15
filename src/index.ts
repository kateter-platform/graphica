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

import { Vector3 } from "three";
import Arc from "./Components/Arc";
import Grid from "./Components/Grid";
import Line from "./Components/Line";
import Point from "./Components/Point";
import Polygon from "./Components/Shape";
import Vector from "./Components/Vector";
import Graphica from "./Graphica";

// export * as three from "three";

const g = new Graphica();
const gg = new Grid();

const v = new Line([-2, 2], [-10, 0], {
  draggable: "unrestricted",
});

const p = new Polygon([
  [1, 1],
  [2, 3],
  [4, 4],
]);

g.add(p);
g.add(v);
g.add(gg);
console.log(g.draggables);
g.run((t) => {});
