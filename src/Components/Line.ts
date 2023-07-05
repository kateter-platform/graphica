import { Vector2, OrthographicCamera } from "three";
import { LineGeometry, LineMaterial } from "three-fatline";
import { toVector3 } from "../utils";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

export type LineOptions = {
  color?: number;
  lineWidth?: number;
};

export const defaultLineOptions: LineOptions = {
  color: 0x080007,
  lineWidth: 4,
};

class Line extends Component {
  start: InputPosition;
  end: InputPosition;
  draggable = undefined;

  constructor(start: InputPosition, end: InputPosition, options?: LineOptions) {
    super();
    const { color, lineWidth } = { ...defaultLineOptions, ...options };

    this.start = start;
    this.end = end;

    this.material = new LineMaterial({
      color: color,
      linewidth: lineWidth,
      resolution: new Vector2(window.innerWidth, window.innerHeight),
      dashed: false,
    });

    this.geometry = new LineGeometry();
    this.updateGeometry(start, end);
  }

  public updateGeometry(start: InputPosition, end: InputPosition) {
    const startPosition = toVector3(start);
    const endPosition = toVector3(end);

    (this.geometry as LineGeometry).setPositions([
      startPosition.x,
      startPosition.y,
      0,
      endPosition.x,
      endPosition.y,
      0,
    ]);
  }

  update(_camera: OrthographicCamera) {
    this.updateGeometry(this.start, this.end);
  }
}

export default Line;
