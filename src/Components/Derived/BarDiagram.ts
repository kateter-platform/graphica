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
import { InputPosition } from "../types";
import { toVector2 } from "../../utils";

type BarDiagramOptions = {
  basePosition?: [number, number];
  xAxisUnit?: string;
  yAxisUnit?: string;
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

  maxNegativeElement: number;

  barsObject: { [key: number]: [Polygon, Text, Text] };

  // For sorting
  // barsObjects: [[Polygon, Text, Text]];

  constructor(
    data: number[],
    labels: string[],
    xAxisTitle: string,
    yAxisTitle: string,
    diagramTitle?: string,
    options?: BarDiagramOptions
  ) {
    super();
    this.data = data;
    this.labels = labels;
    this.xAxisTitle = xAxisTitle;
    this.yAxisTitle = yAxisTitle;
    this.diagramTitle = diagramTitle ? diagramTitle : "";
    this.xAxisUnit = options?.xAxisUnit ? options?.xAxisUnit : "";
    this.yAxisUnit = options?.yAxisUnit ? options?.yAxisUnit : "";
    this.basePosition = options?.basePosition ? options?.basePosition : [0, 0];

    this.maxLength = 36;
    this.maxHeight = 20;

    // Extra fields
    this.fontSize = 26;
    this.distanceMultiplierBarLabels = 0.03;
    this.labelsNextToLinePosition =
      -this.fontSize * this.distanceMultiplierBarLabels;

    this.maxData = Math.max(...this.data.map(Math.abs));
    // this.maxData = Math.max(...this.data);
    this.maxNegativeElement = this.data.reduce((a, b) => {
      if (a < b) {
        return a;
      } else {
        return b;
      }
    });

    const totalHeightOfBars =
      1.25 * (Math.max(...this.data) + -this.maxNegativeElement);
    this.normalizationFactor = totalHeightOfBars / this.maxHeight;

    this.barsObject = {};

    this.position.set(this.basePosition[0], this.basePosition[1], 0);
    this.createBarDiagram();

    // this.switchBars(11, 33);
  }

  createBarDiagram() {
    const basePosition = this.makeBars(this.data, this.labels);

    const stringLengthMultiplier = 0.2; //For distributing the yAxisTitle and horizontal line-labels

    const [xLineCoord, yLineCoord] = this.addAxes(
      basePosition,
      stringLengthMultiplier
    );

    this.addTitle([basePosition, yLineCoord[1][1]]);

    this.addAxisUnits(xLineCoord, yLineCoord);
    const numOfLines = 5;
    const length = xLineCoord[1][0];
    // console.log("LENGDE NEDOVER:", yLineCoord[0][1]);
    this.addHorizontalLines(stringLengthMultiplier, length, yLineCoord[0][1]);
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
      elem = elem / this.normalizationFactor;
      return elem;
    });

    while (counter < normalizedData.length) {
      const height = normalizedData[counter];

      const bar = new Polygon(
        [
          [0, height],
          [widthOfBars, height],
          [widthOfBars, 0],
          [0, 0],
        ],
        { transparent: false, opacity: 1.0 }
      );
      bar.setPosition([basePosition, 0]);

      // console.log("BAR HAR ID: ", bar.id);

      const barIsPositive = this.data[counter] >= 0;

      const textLabelPos = barIsPositive
        ? this.labelsNextToLinePosition
        : -this.labelsNextToLinePosition;

      const label = new Text(this.labels[counter], {
        fontSize: this.fontSize,
        position: [basePosition + widthOfBars / 2, textLabelPos],
        anchorX: "center",
        anchorY: barIsPositive ? "bottom" : "top",
      });

      const addMargin = barIsPositive ? 0.1 : -0.1;
      const valueOfBar = new Text("" + this.data[counter], {
        fontSize: this.fontSize,
        position: [basePosition + widthOfBars / 2, height + addMargin],
        anchorX: "center",
        anchorY: barIsPositive ? "bottom" : "top",
      });

      basePosition += widthOfBars + spacingBetweenBars;
      counter++;
      allBars.add(bar);
      allBarsLabels.add(label);
      allBarsLabels.add(valueOfBar);

      this.barsObject[bar.id] = [bar, label, valueOfBar];
    }
    this.add(allBars);
    this.add(allBarsLabels);
    console.log(this.barsObject);
    return basePosition;
  }

  addAxes(basePosition: number, stringLengthMultiplier: number) {
    const axes = new Group();
    // console.log("HEI");

    let isOnlyPositives = true;
    this.data.forEach((elem) => {
      if (elem < 0) {
        isOnlyPositives = false;
      }
    });

    // const minY = isOnlyPositives
    //   ? 0
    //   : (maxNegativeElement / normalizeFactorHeight) * 1.25;

    const xLineCoord: Position = [
      [0, 0],
      [basePosition, 0],
    ];
    const yLineCoord: Position = [
      [0, (1.25 * this.maxNegativeElement) / this.normalizationFactor],
      [0, (1.25 * Math.max(...this.data)) / this.normalizationFactor],
    ];

    const xLine = new Line(xLineCoord[0], xLineCoord[1], { arrowhead: true });
    const yLine = new Line(yLineCoord[0], yLineCoord[1], {
      arrowhead: true,
    });

    const xAxisTitle = new Text(this.xAxisTitle, {
      fontSize: this.fontSize + 6,
      position: [basePosition / 2, this.labelsNextToLinePosition * 2.5],
      anchorX: "center",
    });
    const yAxisTitle = new Text(this.yAxisTitle, {
      fontSize: this.fontSize + 6,
      position: [
        this.labelsNextToLinePosition * 2.5 -
          this.maxData.toString().length * 2 * stringLengthMultiplier,
        (yLineCoord[1][1] + yLineCoord[0][1]) / 2,
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
        fontSize: this.fontSize + 12,
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
    stringLengthMultiplier: number,
    length: number,
    minYForYLine: number
  ) {
    const horizontalLines = new Group();
    const lineLabels = new Group();
    const gray = 0xaaaaaa;
    const opacity = 0.8;

    // Lines above y = 0
    // Finne "fineste tallet" rundt det maksimale tallet (bruke lengden av tallet til å runde av til nærmeste)
    // finne heltallsdivisor på 3, 4, 5
    // lage linjer over og under x = 0 basert på disse
    // const roundToNDigits =
    //   this.maxData.toString().length - 1 >= 0
    //     ? this.maxData.toString().length - 1
    //     : 0;

    const maxNiceNumber = this.roundNumberToNearestDigit(
      this.maxData,
      this.maxData.toString().length - 1
    );
    // console.log(Math.round(1203 / roundingMultiplier) * roundingMultiplier);
    // console.log(maxNiceNumber);
    // Choose best distribution of lines based on maxNiceNumber
    const numOfLines =
      maxNiceNumber % 5 === 0
        ? 5
        : maxNiceNumber % 4 === 0
        ? 4
        : maxNiceNumber % 3 === 0
        ? 3
        : 4;

    // const numOfLines = 5;
    const spacing = maxNiceNumber / numOfLines;
    let yUp = spacing;
    const yMax = maxNiceNumber;
    const yMin = minYForYLine;
    while (yUp < yMax) {
      const [valueLabel, horizontalLine] = this.addHorizontalLine(
        yUp,
        length,
        stringLengthMultiplier,
        gray,
        opacity
      );
      lineLabels.add(valueLabel);
      horizontalLines.add(horizontalLine);
      yUp += spacing;
    }
    // for (let i = 1; i < numOfLines + 1; i++) {
    //   // const yCoordForLine =
    //   //   (this.maxData / this.normalizationFactor / numOfLines) * i;

    //   const yCoordForLine = (maxNiceNumber / numOfLines) * i;
    //   // console.log(yCoordForLine);

    //   const [valueLabel, horizontalLine] = this.addHorizontalLine(
    //     yCoordForLine,
    //     length,
    //     stringLengthMultiplier,
    //     gray,
    //     opacity
    //   );
    //   lineLabels.add(valueLabel);
    //   horizontalLines.add(horizontalLine);
    // }

    // Lines below x = 0

    let yDown = -spacing;
    while (yDown / this.normalizationFactor > minYForYLine) {
      const [label, line] = this.addHorizontalLine(
        yDown,
        length,
        stringLengthMultiplier,
        gray,
        opacity
      );
      lineLabels.add(label);
      horizontalLines.add(line);

      yDown -= spacing;
    }
    this.add(horizontalLines);
    this.add(lineLabels);
  }

  addHorizontalLine(
    y: number,
    length: number,
    stringLengthMultiplier: number,
    color: number,
    opacity: number
  ): [Text, Line] {
    const line = new Line(
      [0, y / this.normalizationFactor],
      [length, y / this.normalizationFactor],
      {
        color: color,
        opacity: opacity,
      }
    );

    const label = new Text("" + y, {
      position: [
        this.labelsNextToLinePosition -
          y.toString().length * stringLengthMultiplier,
        y / this.normalizationFactor,
      ],
      fontSize: this.fontSize,
      anchorY: "middle",
      anchorX: "left",
    });

    return [label, line];
  }

  roundNumberToNearestDigit(numberToRound: number, numDigits: number) {
    const roundingMultiplier = Math.pow(10, numDigits);
    return Math.round(numberToRound / roundingMultiplier) * roundingMultiplier;
  }
  setColorForBar() {}

  switchBars(barID1: number, barID2: number) {
    // Må flytte om på polygon, label og tall
    const bar1 = this.barsObject[barID1];
    const bar2 = this.barsObject[barID2];

    const newX1 = bar1[0].position.x;
    const newX2 = bar2[0].position.x;

    const label1Pos = [bar1[1].position.x, bar1[1].position.y];
    const value1Pos = [bar1[2].position.x, bar1[2].position.y];

    const label2Pos = [bar2[1].position.x, bar2[1].position.y];
    const value2Pos = [bar2[2].position.x, bar2[2].position.y];

    bar1[0].setPosition([newX2, 0]);
    bar1[1].setPosition([label2Pos[0], label1Pos[1]]);
    bar1[2].setPosition([value2Pos[0], value1Pos[1]]);

    bar2[0].setPosition([newX1, 0]);
    bar2[1].setPosition([label1Pos[0], label2Pos[1]]);
    bar2[2].setPosition([value1Pos[0], value2Pos[1]]);
  }

  //*  For å lage noe så må man lage en form/shape OG et materiale som er hvordan det skal se ut.
  //*   For hvert elem i data vil vi lage Shape/Polygon som matcher. Høyden er lik data[i] og bredden er lik 1.
  //* Posisjon må settes bortover, med y=0
  //* Label må over hver bar med teksten labels[i]
  //* Må ha linjer rett opp og rett bortover. Linjen oppover må være like lang som max(data) og linjen bortover må være like lang som data.length
  //* Vil ha bredde på BarDiagram lik en maxLengde (nå på 36)

  // Funksjon for å bytte om på søyler
  // setColor()
  // swapColumns() (fargelagte søyler når de byttes)
  // Linjer: runde av til nærmeste "fine tall" for den høyeste verdien
  // Fastsette maxHeight for diagrammet
  //

  //   Kombinasjon av disse: https://www.geeksforgeeks.org/bar-graph-meaning-types-and-examples/ OG https://www.math-only-math.com/bar-graph.html
  //  Aksetitler sentrert basert på lengden av aksen og går henholdsvis loddrett og vannrett
  // Benevning av akser rett utenfor pilspissen
  //   Horisontale linjer bortover fra yAxis
  //   Man skal kunne oppdatere søylene med knapper

  //! OBS: Makshøyde funker ikke med negative tall
  // ! Endre bars til å lage i origo og så sette posisjon (?)
}

export default BarDiagram;
