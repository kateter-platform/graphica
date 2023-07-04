import { Vector2 } from "three";
import Arcc from "./Components/Arcc";
import Grid from "./Components/Grid";
import Line from "./Components/Line";
import Point from "./Components/Point";
import Text from "./Components/Text";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();
// const point = new Point(10, 10, { label: true, draggable: "unrestricted" });
// const line = new Line([0, 0], point, { color: 0x000000, lineWidth: 4 });
// const text = new Text("Hello World this is awesome!", {
//   position: [0, 10],
//   color: "black",
//   fontSize: 10,
//   anchorX: "left",
//   anchorY: "bottom",
// });
const pointA = new Point(20, 30, {
  draggable: "unrestricted",
  color: "#F4493B",
});
const pointB = new Point(70, 60, { draggable: "unrestricted" });
const pointC = new Point(40, 20, {
  draggable: "unrestricted",
  color: "#F4493B",
});
const arc = new Arcc({
  pointA: new Vector2(20, 30),
  pointB: new Vector2(70, 60),
  pointC: new Vector2(40, 20),
  radius: 15,
});
const linjetest = new Line([0, 0], [50, 50], {});
graphica.add(linjetest);

graphica.add(grid);
// graphica.add(line);
// graphica.add(point);
// graphica.add(text);
//graphica.add(arc);
graphica.add(pointA);
graphica.add(pointB);
graphica.add(pointC);

graphica.run();
