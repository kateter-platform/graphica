import { Vector2, Object3D, Group, OrthographicCamera } from "three";
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
};

const defaultLabelOptions: LabelOptions = {
  start: new Vector2(0, 0),
  deltaX: 4,
  deltaY: 20,
};

class Label extends Component {
  object: Object3D;
  draggable = undefined;

  constructor(text: string, options?: LabelOptions) {
    const { start, deltaX, deltaY } = {
      ...defaultLabelOptions,
      ...options,
    };
    super();
    // set position of the point instance
    this.position.set(
      toVector3(start).x,
      toVector3(start).y,
      toVector3(start).z
    );

    // calculate break and end points
    const breakPoint = this.calculateBreakPoint(deltaX, deltaY);
    const endPoint = this.calculateEndPoint(deltaX, deltaY);

    // Create line and text components
    const line1 = new Line(start, breakPoint);
    const line2 = new Line(breakPoint, endPoint);
    const textComponent = new Text(text, {
      color: "black",
      fontSize: 15,
      anchorY: "middle",
      anchorX: deltaX < 0 ? "right" : "left",
    });
    textComponent.setPosition([
      endPoint.x + (deltaX < 0 ? -1 : 1) * 10,
      endPoint.y,
    ]);

    // Create a group to contain both lines and text
    this.object = new Group();
    this.object.add(line1);
    this.object.add(line2);
    this.object.add(textComponent);

    // set position of the group
    this.object.position.set(1, 5, 5);
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
    this.object.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
  }
}
export default Label;
