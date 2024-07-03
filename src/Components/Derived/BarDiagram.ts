import { Group } from "three";
import Polygon from "../Shape";
import Text from "../Text";
import Line from "../Line";
import { Component } from "../interfaces";
import { InputPosition } from "../types";
import { toVector2 } from "../../utils";

type BarDiagramOptions = {
  basePosition?: InputPosition;
  diagramTitle?: string;
  xAxisUnit?: string;
  yAxisUnit?: string;
};

type Position = [InputPosition, InputPosition];

type InfoAboutBar = [Polygon, Text, Text, number];

class BarDiagram extends Component {
  data: number[];
  labels: string[];
  xAxisTitle: string;
  yAxisTitle: string;
  diagramTitle: string | undefined;
  xAxisUnit: string | undefined;
  yAxisUnit: string | undefined;
  basePosition: InputPosition | undefined;

  maxLength: number;
  maxHeight: number;

  fontSize: number;
  labelsNextToLinePosition: number;
  normalizationFactor: number;

  biggestElement: number;
  smallestElement: number;

  barsObject: { [key: number]: InfoAboutBar };

  constructor(
    data: number[],
    labels: string[],
    xAxisTitle: string,
    yAxisTitle: string,
    options?: BarDiagramOptions
  ) {
    super();
    this.data = data;
    this.labels = labels;
    this.xAxisTitle = xAxisTitle;
    this.yAxisTitle = yAxisTitle;
    this.diagramTitle = options?.diagramTitle ? options?.diagramTitle : "";
    this.xAxisUnit = options?.xAxisUnit ? options?.xAxisUnit : "";
    this.yAxisUnit = options?.yAxisUnit ? options?.yAxisUnit : "";
    this.basePosition = options?.basePosition ? options?.basePosition : [0, 0];

    this.maxLength = 36;
    this.maxHeight = 15;

    this.fontSize = 26;
    // Used for calculating the distance from the label of the bar from the axisline
    const distanceMultiplierBarLabels = 0.03;
    this.labelsNextToLinePosition =
      -this.fontSize * distanceMultiplierBarLabels;

    this.biggestElement = Math.max(...this.data);
    this.smallestElement = this.data.reduce((a, b) => {
      if (a < b) {
        return a;
      } else {
        return b;
      }
    });

    // The barDiagram will always have a max height. This is to make sure that the bars (collectively) always fill up the maxHeight
    const totalHeightOfBars = Math.max(...this.data) + -this.smallestElement;
    this.normalizationFactor = totalHeightOfBars / this.maxHeight;

    this.barsObject = {};

    this.position.set(
      toVector2(this.basePosition).x,
      toVector2(this.basePosition).y,
      0
    );
    this.createBarDiagram();
  }

  createBarDiagram() {
    const basePosition = this.addBars();

    const stringLengthMultiplier = 0.2; //For distributing the yAxisTitle and horizontal line-labels

    const [xLineCoord, yLineCoord] = this.addAxes(basePosition);

    this.addTitle([basePosition, toVector2(yLineCoord[1]).y]);

    this.addAxisUnits(xLineCoord, yLineCoord);

    const length = toVector2(xLineCoord[1]).x;
    this.addHorizontalLines(stringLengthMultiplier, length);
  }

  addBars(): number {
    const allBars = new Group();
    const allBarsLabels = new Group();

    let counter = 0;

    // Want the spacing to be 2/3 of the width of the bars
    // maxLength = numOfBars * width + (numOfBars + 1) * spacingBetweenBars
    const numOfBars = this.data.length;

    const widthOfBars = this.maxLength / ((5 / 3) * numOfBars + 2 / 3);
    const spacingBetweenBars = (2 / 3) * widthOfBars;
    let basePosition = 0 + spacingBetweenBars;

    // Normalize the data to fit the max height of the diagram
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

      // If the bar is positive, the text label should be below the line, if negative it should be above
      const textLabelPos = barIsPositive
        ? this.labelsNextToLinePosition
        : -this.labelsNextToLinePosition;

      const label = new Text(this.labels[counter], {
        fontSize: this.fontSize,
        position: [basePosition + widthOfBars / 2, textLabelPos],
        anchorX: "center",
        anchorY: barIsPositive ? "bottom" : "top",
      });

      // If the bar is positive, the value of the bar should be displayed above the bar, otherwise it should be below the bar
      const addMargin = barIsPositive ? 0.1 : -0.1;
      const valueOfBar = new Text("" + this.data[counter], {
        fontSize: this.fontSize,
        position: [basePosition + widthOfBars / 2, height + addMargin],
        anchorX: "center",
        anchorY: barIsPositive ? "bottom" : "top",
      });

      // Add the  bars, label and value to an object for access to them later (for example when switching bars)
      this.barsObject[counter] = [bar, label, valueOfBar, this.data[counter]];
      basePosition += widthOfBars + spacingBetweenBars;
      counter++;

      allBars.add(bar);
      allBarsLabels.add(label);
      allBarsLabels.add(valueOfBar);
    }
    this.add(allBars);
    this.add(allBarsLabels);
    return basePosition;
  }

  addAxes(xAxisEnd: number) {
    const axes = new Group();

    const xLineCoord: Position = [
      [0, 0],
      [xAxisEnd, 0],
    ];
    const yLineCoord: Position = [
      [0, (1.25 * this.smallestElement) / this.normalizationFactor],
      [0, (1.25 * Math.max(...this.data)) / this.normalizationFactor],
    ];

    const xLine = new Line(xLineCoord[0], xLineCoord[1], { arrowhead: true });
    const yLine = new Line(yLineCoord[0], yLineCoord[1], {
      arrowhead: true,
    });

    const hasNegativeBar = this.hasNegativeBar();

    // Change the position of the xAxisTitle based on if there are negative bars
    const xAxisPosition: [number, number] = !hasNegativeBar
      ? [xAxisEnd / 2, this.labelsNextToLinePosition * 2.5]
      : [toVector2(xLineCoord[1]).x + 0.1, 0];
    const anchorX = !hasNegativeBar ? "center" : "left";
    const anchorY = !hasNegativeBar ? "bottom" : "middle";

    // Change content of the xAxisTitle based on if there are negative bars (and a unit)
    const xTitle = hasNegativeBar
      ? this.xAxisUnit
        ? this.xAxisTitle + "(" + this.xAxisUnit + ")"
        : this.xAxisTitle
      : this.xAxisTitle;

    const xAxisTitle = new Text(xTitle, {
      fontSize: this.fontSize + 6,
      position: xAxisPosition,
      anchorX: anchorX,
      anchorY: anchorY,
    });
    const yAxisTitle = new Text(this.yAxisTitle, {
      fontSize: this.fontSize + 6,
      position: [
        3 * this.labelsNextToLinePosition,
        (toVector2(yLineCoord[1]).y + toVector2(yLineCoord[0]).y) / 2,
      ],
      anchorX: "center",
      anchorY: "bottom",
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
    const hasNegativeBar = this.hasNegativeBar();

    if (this.xAxisUnit && !hasNegativeBar) {
      const xAxisUnit = new Text(this.xAxisUnit, {
        fontSize: this.fontSize,
        position: [toVector2(xLineCoord[1]).x + 0.1, 0],
        anchorX: "left",
        anchorY: "middle",
      });
      this.add(xAxisUnit);
    }

    if (this.yAxisUnit) {
      const yAxisUnit = new Text(this.yAxisUnit, {
        fontSize: this.fontSize,
        position: [0, toVector2(yLineCoord[1]).y],
        anchorX: "center",
        anchorY: "bottom",
      });
      this.add(yAxisUnit);
    }
  }

  addHorizontalLines(stringLengthMultiplier: number, length: number) {
    const horizontalLines = new Group();
    const lineLabels = new Group();

    // Calculates the sum of the rounded biggest and smallest numbers
    const maxNicePositiveNumber = this.roundToNiceNumber(this.biggestElement);
    const maxNiceNegativeNumber = this.roundToNiceNumber(this.smallestElement);
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

    // maxLength for the line-values will be as many digits as there are in the largest or smallest number
    const maxLengthOfHorizontalLineValues =
      Math.abs(maxNiceNegativeNumber).toString().length >
      maxNicePositiveNumber.toString().length
        ? Math.abs(maxNiceNegativeNumber).toString().length - 1
        : maxNicePositiveNumber.toString().length - 1;

    // Adds all the lines from the bottom (maxNiceNegativeNumber)
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

  // Used for rounding a number to the nearest a*power of ten. EX: 324 => 300
  roundToNiceNumber(num: number): number {
    if (num === 0) {
      return 0;
    }
    const exponent = Math.floor(Math.log10(Math.abs(num)));

    return Math.round(num / Math.pow(10, exponent)) * Math.pow(10, exponent);
  }

  hasNegativeBar(): boolean {
    let bool = false;
    this.data.forEach((elem) => {
      if (elem < 0) {
        bool = true;
      }
    });
    return bool;
  }

  setColorForBar(barIndex: number, color?: number) {
    const bar = this.barsObject[barIndex][0];
    bar.setColor(color);
  }

  switchBars(barIndex1: number, barIndex2: number) {
    // Get the content for the two indices
    const bar1 = this.barsObject[barIndex1];
    const bar2 = this.barsObject[barIndex2];

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

    // Switch index for bars after switching their places
    this.barsObject[barIndex2] = bar1;
    this.barsObject[barIndex1] = bar2;
  }
}

export default BarDiagram;
