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

  biggestElement: number;
  smallesElement: number;

  barsObject: { [key: number]: [Polygon, Text, Text] };

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
    this.maxHeight = 15;

    // Extra fields
    this.fontSize = 26;
    this.distanceMultiplierBarLabels = 0.03;
    this.labelsNextToLinePosition =
      -this.fontSize * this.distanceMultiplierBarLabels;

    this.maxData = Math.max(...this.data.map(Math.abs));
    this.biggestElement = Math.max(...this.data);
    // this.maxData = Math.max(...this.data);
    this.smallesElement = this.data.reduce((a, b) => {
      if (a < b) {
        return a;
      } else {
        return b;
      }
    });

    const totalHeightOfBars = Math.max(...this.data) + -this.smallesElement;
    this.normalizationFactor = totalHeightOfBars / this.maxHeight;

    this.barsObject = {};

    this.position.set(this.basePosition[0], this.basePosition[1], 0);
    this.createBarDiagram();
  }

  createBarDiagram() {
    const basePosition = this.addBars(this.data, this.labels);

    const stringLengthMultiplier = 0.2; //For distributing the yAxisTitle and horizontal line-labels

    const [xLineCoord, yLineCoord] = this.addAxes(
      basePosition,
      stringLengthMultiplier
    );

    this.addTitle([basePosition, yLineCoord[1][1]]);

    this.addAxisUnits(xLineCoord, yLineCoord);

    const length = xLineCoord[1][0];
    this.addHorizontalLines(stringLengthMultiplier, length);
  }

  addBars(data: number[], labels: string[]): number {
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

      const barIsPositive = this.data[counter] >= 0;

      // If the bar is positive the text label should be below the line, if negative it should be above
      const textLabelPos = barIsPositive
        ? this.labelsNextToLinePosition
        : -this.labelsNextToLinePosition;

      const label = new Text(this.labels[counter], {
        fontSize: this.fontSize,
        position: [basePosition + widthOfBars / 2, textLabelPos],
        anchorX: "center",
        anchorY: barIsPositive ? "bottom" : "top",
      });

      // If the bar is positive the value of the bar should be displayed above the bar, otherwise it should be below the bar
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
    return basePosition;
  }

  addAxes(basePosition: number, stringLengthMultiplier: number) {
    const axes = new Group();

    const xLineCoord: Position = [
      [0, 0],
      [basePosition, 0],
    ];
    const yLineCoord: Position = [
      [0, (1.25 * this.smallesElement) / this.normalizationFactor],
      [0, (1.25 * Math.max(...this.data)) / this.normalizationFactor],
    ];

    const xLine = new Line(xLineCoord[0], xLineCoord[1], { arrowhead: true });
    const yLine = new Line(yLineCoord[0], yLineCoord[1], {
      arrowhead: true,
    });

    let hasNegativeBar = false;
    this.data.forEach((elem) => {
      if (elem < 0) {
        hasNegativeBar = true;
      }
    });

    // Change the position of the xAxisTitle based on if there are negative bars
    const xAxisPosition: [number, number] = !hasNegativeBar
      ? [basePosition / 2, this.labelsNextToLinePosition * 2.5]
      : [xLineCoord[1][0] + 0.1, 0];
    const anchorX = !hasNegativeBar ? "center" : "left";
    const anchorY = !hasNegativeBar ? "bottom" : "middle";

    const xAxisTitle = new Text(this.xAxisTitle, {
      fontSize: this.fontSize + 6,
      position: xAxisPosition,
      anchorX: anchorX,
      anchorY: anchorY,
    });
    const yAxisTitle = new Text(this.yAxisTitle, {
      fontSize: this.fontSize + 6,
      position: [
        this.labelsNextToLinePosition * 2.5 -
          this.maxData.toString().length * 4 * stringLengthMultiplier,
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

  addHorizontalLines(stringLengthMultiplier: number, length: number) {
    const horizontalLines = new Group();
    const lineLabels = new Group();

    const maxNicePositiveNumber = this.roundNumberToNearestDigit(
      this.biggestElement
    );
    const maxNiceNegativeNumber = this.roundNumberToNearestDigit(
      this.smallesElement
    );
    const maxNiceNumber = maxNicePositiveNumber + -maxNiceNegativeNumber;

    // Choose best distribution of lines based on maxNiceNumber
    const numOfLines =
      maxNiceNumber % 3 === 0
        ? 3
        : maxNiceNumber % 4 === 0
        ? 4
        : maxNiceNumber % 5 === 0
        ? 5
        : 4;

    const spacing = maxNiceNumber / numOfLines;
    let y = maxNiceNegativeNumber;

    // maxLengde for tallene skal være så mange desimaler som det er i største og minste tall
    const maxLengthOfHorizontalLineValues =
      Math.abs(maxNiceNegativeNumber).toString().length >
      maxNicePositiveNumber.toString().length
        ? Math.abs(maxNiceNegativeNumber).toString().length - 1
        : maxNicePositiveNumber.toString().length - 1;

    while (y <= maxNicePositiveNumber) {
      if (y === 0) {
        y += spacing;
        continue;
      }
      const [valueLabel, horizontalLine] = this.addHorizontalLine(
        y,
        maxLengthOfHorizontalLineValues,
        length,
        stringLengthMultiplier
      );
      lineLabels.add(valueLabel);
      horizontalLines.add(horizontalLine);
      y += spacing;
    }

    this.add(horizontalLines);
    this.add(lineLabels);
  }

  addHorizontalLine(
    y: number,
    numOfDigits: number,
    length: number,
    stringLengthMultiplier: number
  ): [Text, Line] {
    const line = new Line(
      [0, y / this.normalizationFactor],
      [length, y / this.normalizationFactor],
      {
        color: 0xaaaaaa,
        opacity: 0.8,
      }
    );

    const label = new Text("" + y.toFixed(numOfDigits), {
      position: [
        this.labelsNextToLinePosition -
          y.toFixed(numOfDigits).toString().length * stringLengthMultiplier,
        y / this.normalizationFactor,
      ],
      fontSize: this.fontSize,
      anchorY: "middle",
      anchorX: "left",
    });

    return [label, line];
  }

  roundNumberToNearestDigit(numberToRound: number) {
    if (numberToRound === 0) {
      return 0;
    }
    const exponent = Math.floor(Math.log10(Math.abs(numberToRound)));

    return (
      Math.round(numberToRound / Math.pow(10, exponent)) *
      Math.pow(10, exponent)
    );
  }
  setColorForBar(barID: number, color?: number) {
    const bar = this.barsObject[barID][0];
    bar.setColor(color);
  }

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
