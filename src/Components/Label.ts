import { Vector2, OrthographicCamera } from "three";
import { toVector3 } from "../utils";
import Line from "./Line";
import Text from "./Text";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

const SCALING_FACTOR = 10;

type LabelOptions = {
  start: InputPosition;
  deltaX: number;
  deltaY: number;
  fontSize: number;
};

const defaultLabelOptions: LabelOptions = {
  start: new Vector2(0, 0),
  deltaX: 10,
  deltaY: -5,
  fontSize: 30,
};

class Label extends Component {
  draggable = undefined;

  constructor(text: string, options?: LabelOptions) {
    const { start, deltaX, deltaY, fontSize } = {
      ...defaultLabelOptions,
      ...options,
    };
    super();

    const positionVector3 = toVector3(start);
    // set position of the point instance
    this.position.set(positionVector3.x, positionVector3.y, positionVector3.z);

    // calculate break and end points
    const breakPoint = this.calculateBreakPoint(deltaX, deltaY);
    const endPoint = this.calculateEndPoint(deltaX, deltaY);

    // Create line and text components
    const line1 = new Line(start, breakPoint);
    const line2 = new Line(breakPoint, endPoint);
    const textComponent = new Text(text, {
      color: "black",
      fontSize: fontSize,
      anchorY: "middle",
      anchorX: deltaX < 0 ? "right" : "left",
      responsiveScale: false,
    });
    textComponent.setPosition([
      endPoint.x + (deltaX < 0 ? -1 : 1) * 10,
      endPoint.y,
    ]);

    // Add line and text components to the label
    this.add(line1);
    this.add(line2);
    this.add(textComponent);
  }

  private calculateEndPoint(deltaX: number, deltaY: number) {
    return new Vector2(
      this.position.x + deltaX * SCALING_FACTOR,
      this.position.y + deltaY * SCALING_FACTOR
    );
  }

  private calculateBreakPoint(deltaX: number, deltaY: number) {
    let xValue = deltaX - Math.abs(deltaY);
    let yValue = 0;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      xValue = 0;
      yValue = deltaY - Math.abs(deltaX);

      if (deltaY < 0) {
        yValue = deltaY + Math.abs(deltaX);
      }
    }

    if (deltaX < 0) {
      xValue = deltaX + Math.abs(deltaY);
    }

    return new Vector2(
      this.position.x + xValue * SCALING_FACTOR,
      this.position.y + yValue * SCALING_FACTOR
    );
  }

  update(camera: OrthographicCamera) {
    this.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}
export default Label;
