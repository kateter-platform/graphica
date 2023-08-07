import { Vector2, OrthographicCamera } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { toVector2 } from "../utils";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

const ARROWHEAD_LENGTH = 12;

export type LineOptions = {
  color?: number;
  lineWidth?: number;
  arrowhead?: boolean;
  dashed?: boolean;
};

export const defaultLineOptions: LineOptions = {
  color: 0x080007,
  lineWidth: 4,
  arrowhead: false,
  dashed: false,
};

class Line extends Component {
  start: InputPosition;
  end: InputPosition;
  draggable = undefined;
  arrowhead: boolean;

  constructor(start: InputPosition, end: InputPosition, options?: LineOptions) {
    super();
    const { color, lineWidth, arrowhead, dashed } = {
      ...defaultLineOptions,
      ...options,
    };
    this.start = start;
    this.end = end;
    this.arrowhead = arrowhead ? true : false;

    this.material = new LineMaterial({
      color: color,
      linewidth: lineWidth,
      resolution: new Vector2(window.innerWidth, window.innerHeight),
      dashed: dashed,
    });

    this.geometry = new LineGeometry();
    if (arrowhead) {
      const arrowheadGeometry = new LineGeometry();
      const arrowheadLine = new Line2(
        arrowheadGeometry,
        this.material as LineMaterial
      );
      arrowheadLine.name = "arrowhead";
      this.add(arrowheadLine);
    }
  }

  public updateGeometry(
    start: InputPosition,
    end: InputPosition,
    arrowhead: boolean,
    camera: OrthographicCamera
  ) {
    const startPosition = toVector2(start);
    const endPosition = toVector2(end);

    const direction = startPosition.clone().sub(endPosition).normalize();

    (this.geometry as LineGeometry).setPositions([
      startPosition.x,
      startPosition.y,
      1,
      endPosition.x,
      endPosition.y,
      1,
    ]);

    if (arrowhead) {
      const arrowheadLine = this.getObjectByName("arrowhead") as Line2;
      const arrowheadGeometry = arrowheadLine.geometry as LineGeometry;
      const leftPoint = direction
        .clone()
        .rotateAround(new Vector2(0, 0), Math.PI / 4)
        .multiplyScalar(ARROWHEAD_LENGTH / camera.zoom)
        .add(endPosition);
      const rightPoint = direction
        .clone()
        .rotateAround(new Vector2(0, 0), -Math.PI / 4)
        .multiplyScalar(ARROWHEAD_LENGTH / camera.zoom)
        .add(endPosition);

      arrowheadGeometry.setPositions([
        leftPoint.x,
        leftPoint.y,
        0,
        endPosition.x,
        endPosition.y,
        0,
        rightPoint.x,
        rightPoint.y,
        0,
      ]);
    }
  }

  setEnd(end: InputPosition) {
    this.end = end;
  }

  setStart(start: InputPosition) {
    this.start = start;
  }

  setPosition(start: InputPosition, end: InputPosition) {
    this.start = start;
    this.end = end;
  }

  update(camera: OrthographicCamera) {
    this.updateGeometry(this.start, this.end, this.arrowhead, camera);
  }

  onWindowResize() {
    (this.material as LineMaterial).resolution.set(
      window.innerWidth,
      window.innerHeight
    );
  }
}

export default Line;
