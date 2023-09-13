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
// export { default as Shape } from "./Components/Shape";
// export { default as Slider } from "./Components/Slider";
// export { default as Text } from "./Components/Text";
// export { default as Vector } from "./Components/Vector";
// export { default as Fraction } from "./Components/Derived/Fraction";

import { Vector2 } from "three";
import Grid from "./Components/Grid";
import BoundingBox from "./Components/Physics/Collision/BoundingBox";
import Polygon from "./Components/Shape";
import Graphica from "./Graphica";
import Point from "./Components/Point";

// export * as three from "three";

const a = new Graphica();
const b = new Grid();

const b1 = new Polygon([
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
]);

const b2 = new Polygon([
  [1, 0],
  [2, 0],
  [2, 1],
  [1, 1],
]);

const c = new BoundingBox(b1);

const d = new BoundingBox(b2);

const e = new Point(0, 0, { draggable: "unrestricted" });

a.add(e);
a.add(d);
a.add(c);
a.add(b);
// a.add(b1);
// a.add(b2);

a.run((e: number) => {
  // b1.setPosition([e, e]);
  // b2.setPosition([e, e]);

  console.log(c.collidesWith(d));
  console.log(c.position);
});
