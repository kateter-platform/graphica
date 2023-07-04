import { Vector2 } from "three";
import Arcc from "./Components/Arc";
import Grid from "./Components/Grid";
import Point from "./Components/Point";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();

const pointB = new Point(70, 60, { draggable: "unrestricted" });
const pointA = new Point(20, 30, {
  draggable: "unrestricted",
  color: "#F4493B",
});
const pointC = new Point(40, 20, {
  draggable: "unrestricted",
  color: "#F4493B",
});
const arc = new Arcc({
  pointA: new Vector2(20, 30),
  pointB: new Vector2(70, 60),
  pointC: new Vector2(40, 20),
  radius: 30,
});

graphica.add(grid);
graphica.add(arc);
graphica.add(pointA);
graphica.add(pointB);
graphica.add(pointC);

graphica.run();
