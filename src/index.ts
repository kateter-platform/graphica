import { Vector2 } from "three";
import Grid from "./Components/Grid";
import Latex from "./Components/Latex";
import Plot from "./Components/Plot";
import Point from "./Components/Point";
import Vector from "./Components/Vector";
import Polygon from "./Components/Shape";
import Slider from "./Components/Slider";
import { Component } from "./Components/interfaces";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid({ yLabelText: "y", xLabelText: "x" });

graphica.add(grid);
graphica.run();
