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
let a = new Component();

const l = new Latex(
  " \\sum_{i=1}^{n} [\\sin(x_i)\\cdot\\cos(x_i)+\\sin(x_i)] \\Delta x",
  {
    position: [5, 5],
    fontSize: 30
  }
);

s.addObserver((v) => {
  graphica.remove(a);
  a = new Component();
  const range = 20;
  const stepSize = range / v;
  for (let i = 0; i < range; i += stepSize) {
    a.add(
      new Polygon(
        [
          new Vector2(i, 0),
          new Vector2(i + stepSize, 0),
          new Vector2(i + stepSize, Math.sin(i) * Math.cos(i) + Math.sin(i)),
          new Vector2(i, Math.sin(i) * Math.cos(i) + Math.sin(i)),
        ],
        { fill: false }
      )
    );
  }
  graphica.add(a);
});

graphica.add(l);
graphica.addGui(s);
graphica.add(p);
graphica.add(grid);
graphica.run();
