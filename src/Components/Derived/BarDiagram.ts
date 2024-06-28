import {
  MeshBasicMaterial,
  Shape,
  Mesh,
  Group,
  Object3D,
  ShapeGeometry,
  Event,
  Box3,
  Vector3,
  Vector2,
} from "three";
import { Component } from "../interfaces";
import Polygon from "../Shape";
import Text from "../Text";
import Line from "../Line";

type BarDiagramOptions = {
  //Kan bestemme bredde, farger
  //   fontSize: number;
  //   widthOfBars: number;
  //   spacingBetweenBars: number;
  //   basePosition: [number, number];
};

class BarDiagram extends Component {
  data: number[];
  labels: string[];
  xAxisTitle: string;
  yAxisTitle: string;
  //   xAxisUnit: string;
  //   yAxisUnit: string;

  constructor(
    dataForBars: number[],
    labelsForBars: string[],
    xAxisTitle: string,
    yAxisTitle: string,
    // xAxisUnit?: string | undefined,
    // yAxisUnit?: string | undefined,
    options?: BarDiagramOptions
  ) {
    super();
    this.data = dataForBars;
    this.labels = labelsForBars;
    this.xAxisTitle = xAxisTitle;
    this.yAxisTitle = yAxisTitle;
    // this.xAxisUnit = xAxisUnit;
    // this.yAxisUnit = yAxisUnit;

    this.position.set(0, 0, 0);
    this.createBarDiagram();
  }

  createBarDiagram() {
    // Lage en gruppe med bars
    // const allBars = new Group();

    const allBars = new Group();
    const allLabels = new Group();
    const lines = new Group();

    let counter = 0;

    let basePosition = 0;
    const widthOfBars = 1;
    const spacingBetweenBars = 1;

    const fontSize = 18;

    const distanceMultiplierForLabel = 0.05;
    const labelYPos = -fontSize * distanceMultiplierForLabel;

    while (counter < this.data.length) {
      const height = this.data[counter];

      const bar = new Polygon([
        [basePosition, height],
        [basePosition + widthOfBars, height],
        [basePosition + widthOfBars, 0],
        [basePosition, 0],
      ]);

      const label = new Text(this.labels[counter], {
        fontSize: fontSize,
        position: [basePosition + widthOfBars / 2, labelYPos],
        anchorX: "center",
      });
      const valueOfBar = new Text("" + this.data[counter], {
        fontSize: fontSize,
        position: [basePosition + widthOfBars / 2, height + 0.2],
        anchorX: "center",
      });
      basePosition += widthOfBars + spacingBetweenBars;

      allBars.add(bar);
      allLabels.add(label);
      allLabels.add(valueOfBar);
      counter++;
    }

    const xLine = new Line([0, 0], [basePosition, 0], { arrowhead: true });
    const yLine = new Line([0, 0], [0, Math.max(...this.data) * 1.25], {
      arrowhead: true,
    });
    lines.add(xLine);
    lines.add(yLine);

    const xAxisTitle = new Text(this.xAxisTitle, {
      fontSize: fontSize,
      position: [-1, Math.max(...this.data) * 1.2],
      anchorX: "center",
    });
    const yAxisTitle = new Text(this.yAxisTitle, {
      fontSize: fontSize,
      position: [basePosition, labelYPos],
      anchorX: "center",
    });

    // const xAxisUnit = new Text(this.xAxisUnit, {
    //   fontSize: fontSize,
    //   position: [-1, Math.max(...this.data) * 1.2],
    //   anchorX: "center",
    // });
    // const yAxisUnit = new Text(this.yAxisUnit, {
    //   fontSize: fontSize,
    //   position: [basePosition, labelYPos],
    //   anchorX: "center",
    // });

    allLabels.add(xAxisTitle);
    allLabels.add(yAxisTitle);
    // allLabels.add(xAxisUnit);
    // allLabels.add(yAxisUnit);

    // for (let i = 0; i < this.data.length; i++) {
    //   const height = this.data[i];
    //   const offset = 1;
    //   const basePosition = i;
    //   const bar = new Polygon([
    //     [basePosition, height],
    //     [basePosition + 1, height],
    //     [basePosition + 1, 0],
    //     [basePosition, 0],
    //   ]);
    //   allBars.add(bar);
    // }
    // const allLabels = new Group();
    // for (let i = 0; i < this.labels.length; i++) {
    //   const offset = 0.4;
    //   const pos: [number, number] = [i + offset, this.data[i] + offset];
    //   const label = new Text(this.labels[i], { fontSize: 18, position: pos });
    //   allLabels.add(label);
    // }

    this.add(allBars);
    this.add(allLabels);
    this.add(lines);
  }

  //   For å lage noe så må man lage en form/shape OG et materiale som er hvordan det skal se ut.
  //   For hvert elem i data vil vi lage Shape/Polygon som matcher. Høyden er lik data[i] og bredden er lik 1.
  // Posisjon må settes bortover, med y=0
  // Label må over hver bar med teksten labels[i]
  // Må ha linjer rett opp og rett bortover. Linjen oppover må være like lang som max(data) og linjen bortover må være like lang som data.length

  //   Kombinasjon av disse: https://www.geeksforgeeks.org/bar-graph-meaning-types-and-examples/ OG https://www.math-only-math.com/bar-graph.html
  //  Aksetitler sentrert basert på lengden av aksen og går henholdsvis loddrett og vannrett
  // Benevning av akser rett utenfor pilspissen
  //   Horisontale linjer bortover fra yAxis
}

export default BarDiagram;
