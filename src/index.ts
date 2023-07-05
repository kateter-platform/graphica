import { Vector2 } from "three";
import Arcc from "./Components/Arc";
import Grid from "./Components/Grid";
import Plot from "./Components/Plot";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid({});
const arc = new Arcc({
  pointA: new Vector2(20, 30),
  pointB: new Vector2(70, 60),
  pointC: new Vector2(40, 20),
  radius: 30,
});
const a = new Plot("a*x", { coefficients: { a: 2 } });

graphica.add(a);
graphica.add(grid);
graphica.add(arc);
graphica.run();
