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
  basePosition?: [number, number];
};

type Position = [[number, number], [number, number]];

class BarDiagram extends Component {
  data: number[];
  labels: string[];
  xAxisTitle: string;
  yAxisTitle: string;
  diagramTitle: string | undefined;
  xAxisUnit: string | undefined;
  yAxisUnit: string | undefined;
  basePosition: [number, number] | undefined;

  maxLength: number;
  maxHeight: number;

  // Extra fields
  fontSize: number;
  labelsNextToLinePosition: number;
  distanceMultiplierBarLabels: number;
  maxData: number;
  normalizationFactor: number;

  constructor(
    data: number[],
    labels: string[],
    xAxisTitle: string,
    yAxisTitle: string,
    diagramTitle?: string,
    xAxisUnit?: string,
    yAxisUnit?: string,
    options?: BarDiagramOptions
  ) {
    super();
    this.data = data;
    this.labels = labels;
    this.xAxisTitle = xAxisTitle;
    this.yAxisTitle = yAxisTitle;
    this.diagramTitle = diagramTitle ? diagramTitle : "";
    this.xAxisUnit = xAxisUnit ? xAxisUnit : "";
    this.yAxisUnit = yAxisUnit ? yAxisUnit : "";
    this.basePosition = options?.basePosition ? options?.basePosition : [0, 0];

    this.maxLength = 36;
    this.maxHeight = 10;

    // Extra fields
    this.fontSize = 26;
    this.distanceMultiplierBarLabels = 0.03;
    this.labelsNextToLinePosition =
      -this.fontSize * this.distanceMultiplierBarLabels;

    this.maxData = Math.max(...this.data);
    this.normalizationFactor = this.maxData / 10;

    this.position.set(this.basePosition[0], this.basePosition[1], 0);
    this.createBarDiagram();
  }

  createBarDiagram() {
    // Lage en gruppe med bars

    const basePosition = this.makeBars(this.data, this.labels);

    const stringLengthMultiplier = 0.2; //For distributing the yAxisTitle and horizontal line-labels

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

    const [xLineCoord, yLineCoord] = this.addAxes(
      basePosition,
      stringLengthMultiplier
    );

    this.addTitle([basePosition, yLineCoord[1][1]]);

    this.addAxisUnits(xLineCoord, yLineCoord);
    const numOfLines = 5;
    this.addHorizontalLines(
      numOfLines,
      stringLengthMultiplier,
      xLineCoord,
      yLineCoord
    );
  }

  makeBars(data: number[], labels: string[]): number {
    const allBars = new Group();
    const allBarsLabels = new Group();

    let counter = 0;

    // Want the spacing to be 2/3 of the width of the bars
    // maxLength = numOfBars * width + (numOfBars + 1) * spacingBetweenBars

    const numOfBars = this.data.length;

    const widthOfBars = this.maxLength / ((5 / 3) * numOfBars + 2 / 3);
    const spacingBetweenBars = (2 / 3) * widthOfBars;
    let basePosition = 0 + spacingBetweenBars;

    const normalizedData = this.data.map((elem) => {
      // console.log("ELEM FØR: ", elem)
      elem = elem / this.normalizationFactor;
      //   console.log("ELEM ETTER: ", elem);
      return elem;
    });

    // console.log("Normalisert data: ", this.data);

    while (counter < normalizedData.length) {
      const height = normalizedData[counter];

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
        fontSize: this.fontSize,
        position: [
          basePosition + widthOfBars / 2,
          this.labelsNextToLinePosition,
        ],
        anchorX: "center",
      });
      const valueOfBar = new Text("" + this.data[counter], {
        fontSize: this.fontSize,
        position: [basePosition + widthOfBars / 2, height + 0.1],
        anchorX: "center",
      });
      basePosition += widthOfBars + spacingBetweenBars;

      allBars.add(bar);
      allBarsLabels.add(label);
      allBarsLabels.add(valueOfBar);
      counter++;
    }
    this.add(allBars);
    this.add(allBarsLabels);
    return basePosition;
  }

  addAxes(basePosition: number, stringLengthMultiplier: number) {
    const axes = new Group();

    const xLineCoord: Position = [
      [0, 0],
      [basePosition, 0],
    ];
    const yLineCoord: Position = [
      [0, 0],
      [0, this.maxHeight * 1.25],
    ];

    const xLine = new Line(xLineCoord[0], xLineCoord[1], { arrowhead: true });
    const yLine = new Line(yLineCoord[0], yLineCoord[1], {
      arrowhead: true,
    });

    const xAxisTitle = new Text(this.xAxisTitle, {
      fontSize: this.fontSize,
      position: [basePosition / 2, this.labelsNextToLinePosition * 2.5],
      anchorX: "center",
    });
    const yAxisTitle = new Text(this.yAxisTitle, {
      fontSize: this.fontSize,
      position: [
        this.labelsNextToLinePosition * 2.5 -
          this.maxData.toString().length * stringLengthMultiplier,
        yLineCoord[1][1] / 2,
      ],
      anchorX: "center",
      anchorY: "top",
    });
    yAxisTitle.rotateZ(Math.PI / 2);

    axes.add(xLine);
    axes.add(xAxisTitle);
    axes.add(yLine);
    axes.add(yAxisTitle);

    // Moves the axes in front of the horizontal lines
    xLine.setZIndex(10);
    yLine.setZIndex(10);
    this.add(axes);
    return [xLineCoord, yLineCoord];
  }

  addTitle(position: [number, number]) {
    if (this.diagramTitle) {
      const title = new Text(this.diagramTitle, {
        fontSize: this.fontSize + 8,
        position: [position[0] / 2, position[1] + 0.5],
        anchorX: "center",
      });
      this.add(title);
    }
  }

  addAxisUnits(xLineCoord: Position, yLineCoord: Position) {
    if (this.xAxisUnit) {
      const xAxisUnit = new Text(this.xAxisUnit, {
        fontSize: this.fontSize,
        position: [xLineCoord[1][0] + 0.1, 0],
        anchorX: "left",
        anchorY: "middle",
      });
      this.add(xAxisUnit);
    }

    if (this.yAxisUnit) {
      const yAxisUnit = new Text(this.yAxisUnit, {
        fontSize: this.fontSize,
        position: [0, yLineCoord[1][1]],
        anchorX: "center",
        anchorY: "bottom",
      });
      this.add(yAxisUnit);
    }
  }

  addHorizontalLines(
    numOfLines: number,
    stringLengthMultiplier: number,
    xLineCoord: Position,
    yLineCoord: Position
  ) {
    const horizontalLines = new Group();
    const lineLabels = new Group();
    const gray = 0xaaaaaa;

    for (let i = 1; i < numOfLines + 1; i++) {
      const yCoord = (this.maxData / this.normalizationFactor / numOfLines) * i;
      const valueLine = new Line([0, yCoord], [xLineCoord[1][0], yCoord], {
        color: gray,
      });
      horizontalLines.add(valueLine);
      const yValue = Math.round(yCoord * this.normalizationFactor);
      const valueOfValueLine = new Text("" + yValue, {
        position: [
          this.labelsNextToLinePosition -
            yValue.toString().length * stringLengthMultiplier,
          yCoord,
        ],
        fontSize: this.fontSize,
        anchorY: "middle",
        anchorX: "left",
      });
      lineLabels.add(valueOfValueLine);
      this.add(horizontalLines);
      this.add(lineLabels);
    }
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
  //* Vil ha bredde på BarDiagram lik en maxLengde (nå på 36)

  //   Kombinasjon av disse: https://www.geeksforgeeks.org/bar-graph-meaning-types-and-examples/ OG https://www.math-only-math.com/bar-graph.html
  //  Aksetitler sentrert basert på lengden av aksen og går henholdsvis loddrett og vannrett
  // Benevning av akser rett utenfor pilspissen
  //   Horisontale linjer bortover fra yAxis
  //  5 linjer uansett. Kan ta max-tallet fra data og rounde av til nærmeste 2, 5, 10, 25, 50, 100, osv.
  //   Man skal kunne oppdatere søylene med knapper
}

export default BarDiagram;
