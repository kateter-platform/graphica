import { Vector2 } from "three";
import Grid from "./Components/Grid";
import Latex from "./Components/Latex";
import Plot from "./Components/Plot";
import Polygon from "./Components/Shape";
import Slider from "./Components/Slider";
import { Component } from "./Components/interfaces";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();

const p = new Plot("cos(x)* sin(x) + sin(x)");
const s = new Slider({ maxValue: 99, minValue: 1 });

const l = new Latex(" hei test", {
  position: [5, 5],
  fontSize: 30,
});

graphica.add(l);
graphica.add(p);
graphica.add(grid);
graphica.run();
