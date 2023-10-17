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

import { Vector2, Vector3 } from "three";
import Arc from "./Components/Arc";
import Grid from "./Components/Grid";
import Label from "./Components/Label";
import Line from "./Components/Line";
import Point from "./Components/Point";
import Polygon from "./Components/Shape";
import Vector from "./Components/Vector";
import Graphica from "./Graphica";
import Fraction from "./Components/Derived/Fraction";
import Circle from "./Components/Circle";

const g = new Graphica();
const gg = new Grid();
const line = new Line(new Vector2(2, 2), [5, 5], { draggable: "unrestricted" });

const pp = new Point(0, 0, { draggable: "unrestricted", label: true });
const pp2 = new Point(0, 1, { draggable: "unrestricted" });
const s = new Circle(5, 5, 50);
const c = new Polygon([
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
]);

g.add(gg);
g.add(s);
g.add(c);
g.add(line);
g.add(pp);
g.add(pp2);

g.run(() => {
  console.log("Sirkel: " + s.position.z);
  console.log("polygon: " + c.position.z);
});
