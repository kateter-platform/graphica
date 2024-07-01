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
  basePositionX?: number;
};

class BarDiagram extends Component {
  data: number[];
  labels: string[];
  xAxisTitle: string;
  yAxisTitle: string;
  xAxisUnit: string | undefined;
  yAxisUnit: string | undefined;
  basePositionX: number | undefined;

  constructor(
    dataForBars: number[],
    labelsForBars: string[],
    xAxisTitle: string,
    yAxisTitle: string,
    xAxisUnit?: string,
    yAxisUnit?: string,
    options?: BarDiagramOptions
  ) {
    super();
    this.data = dataForBars;
    this.labels = labelsForBars;
    this.xAxisTitle = xAxisTitle;
    this.yAxisTitle = yAxisTitle;
    this.xAxisUnit = xAxisUnit ? xAxisUnit : "";
    this.yAxisUnit = yAxisUnit ? yAxisUnit : "";
    this.basePositionX = options?.basePositionX ? options?.basePositionX : 0;

    this.position.set(this.basePositionX, 0, 0);
    this.createBarDiagram();
  }

  createBarDiagram() {
    // Lage en gruppe med bars

    const allBars = new Group();
    const allLabels = new Group();
    const lines = new Group();

    let counter = 0;

    let basePosition = 0;
    const widthOfBars = 3;
    const spacingBetweenBars = 3;

    const fontSize = 26;

    const distanceMultiplierForBarLabels = 0.03;
    const labelsNextToLinePos = -fontSize * distanceMultiplierForBarLabels;

    const maxData = Math.max(...this.data);
    const normalizationFactor = maxData / 10;

    this.data = this.data.map((elem) => {
      // console.log("ELEM FØR: ", elem)
      elem = elem / normalizationFactor;
      //   console.log("ELEM ETTER: ", elem);
      return elem;
    });

    // console.log("Normalisert data: ", this.data);

    while (counter < this.data.length) {
      const height = this.data[counter];

      const bar = new Polygon(
        [
          [basePosition, height],
          [basePosition + widthOfBars, height],
          [basePosition + widthOfBars, 0],
          [basePosition, 0],
        ],
        { transparent: false, opacity: 1.0 }
      );

      const label = new Text(this.labels[counter], {
        fontSize: fontSize,
        position: [basePosition + widthOfBars / 2, labelsNextToLinePos],
        anchorX: "center",
      });
      const valueOfBar = new Text(
        "" + this.data[counter] * normalizationFactor,
        {
          fontSize: fontSize,
          position: [basePosition + widthOfBars / 2, height + 0.1],
          anchorX: "center",
        }
      );
      basePosition += widthOfBars + spacingBetweenBars;

      allBars.add(bar);
      allLabels.add(label);
      allLabels.add(valueOfBar);
      counter++;
    }

    const xLineEndpoint: [number, number] = [basePosition, 0];
    const yLineEndpoint: [number, number] = [0, Math.max(...this.data) * 1.25];
    const stringLengthMultiplier = 0.2; //For distributing the yAxisTitle and horizontal line-labels

    const xLine = new Line([0, 0], xLineEndpoint, { arrowhead: true });
    const yLine = new Line([0, 0], yLineEndpoint, {
      arrowhead: true,
    });

    const xAxisTitle = new Text(this.xAxisTitle, {
      fontSize: fontSize,
      position: [basePosition / 2, labelsNextToLinePos * 2.5],
      anchorX: "center",
    });
    const yAxisTitle = new Text(this.yAxisTitle, {
      fontSize: fontSize,
      position: [
        labelsNextToLinePos * 2.5 -
          maxData.toString().length * stringLengthMultiplier,
        yLineEndpoint[1] / 2,
      ],
      anchorX: "center",
      anchorY: "top",
    });
    yAxisTitle.rotateZ(Math.PI / 2);

    allLabels.add(xAxisTitle);
    allLabels.add(yAxisTitle);

    // Horizontal lines
    // const niceInterval = this.calculateNiceInterval(maxData);
    // const yAxisLabels = this.generateYAxisLabels(maxData, niceInterval);

    // Add horizontal lines and y-axis labels
    // for (let yCoord of yAxisLabels) {
    //   const valueLine = new Line([0, yCoord], [xLineEndpoint[0], yCoord], {
    //     color: 0xaaaaaa,
    //   });
    //   lines.add(valueLine);
    //   const valueOfValueLine = new Text("" + yCoord * normalizationFactor, {
    //     position: [labelsNextToLinePos, yCoord],
    //     fontSize: fontSize,
    //     anchorY: "middle",
    //     anchorX: "left",
    //   });
    //   allLabels.add(valueOfValueLine);
    // }
    const numOfLines = 5;
    for (let i = 1; i < numOfLines + 1; i++) {
      const yCoord = (maxData / normalizationFactor / numOfLines) * i;
      const valueLine = new Line([0, yCoord], [xLineEndpoint[0], yCoord], {
        color: 0xaaaaaa,
      });
      lines.add(valueLine);
      const yValue = Math.round(yCoord * normalizationFactor);
      const valueOfValueLine = new Text("" + yValue, {
        position: [
          labelsNextToLinePos -
            yValue.toString().length * stringLengthMultiplier,
          yCoord,
        ],
        fontSize: fontSize,
        anchorY: "middle",
        anchorX: "left",
      });
      allLabels.add(valueOfValueLine);
    }

    lines.add(xLine);
    lines.add(yLine);
    xLine.setZIndex(10);
    yLine.setZIndex(10);

    if (this.xAxisUnit) {
      const xAxisUnit = new Text(this.xAxisUnit, {
        fontSize: fontSize,
        position: [xLineEndpoint[0] + 0.1, 0],
        anchorX: "left",
        anchorY: "middle",
      });
      allLabels.add(xAxisUnit);
    }

    if (this.yAxisUnit) {
      const yAxisUnit = new Text(this.yAxisUnit, {
        fontSize: fontSize,
        position: [0, yLineEndpoint[1]],
        anchorX: "center",
        anchorY: "bottom",
      });
      allLabels.add(yAxisUnit);
    }

    this.add(lines);
    this.add(allBars);
    this.add(allLabels);
  }

  //   // Function to calculate a nice interval
  //   calculateNiceInterval(maxData: number): number {
  //     const niceNumbers = [1, 2, 5, 10, 25, 50, 100];
  //     let interval = 1;
  //     for (let i = 0; i < niceNumbers.length; i++) {
  //       if (maxData / niceNumbers[i] <= 5) {
  //         interval = niceNumbers[i];
  //         break;
  //       }
  //     }
  //     return interval;
  //   }

  //   // Function to generate y-axis labels based on the nice interval
  //   generateYAxisLabels(maxData: number, interval: number): number[] {
  //     const labels = [];
  //     for (let i = 0; i <= Math.ceil(maxData / interval); i++) {
  //       labels.push(i * interval);
  //     }
  //     return labels;
  //   }

  //*  For å lage noe så må man lage en form/shape OG et materiale som er hvordan det skal se ut.
  //*   For hvert elem i data vil vi lage Shape/Polygon som matcher. Høyden er lik data[i] og bredden er lik 1.
  //* Posisjon må settes bortover, med y=0
  //* Label må over hver bar med teksten labels[i]
  //* Må ha linjer rett opp og rett bortover. Linjen oppover må være like lang som max(data) og linjen bortover må være like lang som data.length

  //   Kombinasjon av disse: https://www.geeksforgeeks.org/bar-graph-meaning-types-and-examples/ OG https://www.math-only-math.com/bar-graph.html
  //  Aksetitler sentrert basert på lengden av aksen og går henholdsvis loddrett og vannrett
  // Benevning av akser rett utenfor pilspissen
  //   Horisontale linjer bortover fra yAxis
  //  5 linjer uansett. Kan ta max-tallet fra data og rounde av til nærmeste 2, 5, 10, 25, 50, 100, osv.
  //   Man skal kunne oppdatere søylene med knapper
}

export default BarDiagram;
