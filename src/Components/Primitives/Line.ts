import { Vector2, OrthographicCamera } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { toVector2 } from "../../utils";
import { Component } from "../Component";
import { InputPosition } from "./../Types/InputPosition";

const ARROWHEAD_LENGTH = 12;

/**
 * Properties for a Line
 * @typedef {Object} LineProps
 *
 * @property {number} [color=0x000000] - The color of the line as a hex value.
 * @property {number} [lineWidth=4] - The width of the line.
 * @property {boolean} [static=false] - If true, the line is static and cannot be manipulated.
 */
export type LineProps = {
  color?: number;
  lineWidth?: number;
  static?: boolean;
  arrowhead?: boolean;
};

/**
 * Represents a line in a 2D space.
 *
 * @extends {Component}
 */
class Line extends Component {
  start: InputPosition;
  end: InputPosition;
  arrowhead: boolean;
  draggable = undefined;

  /**
   * Create a new line.
   *
   * @param {InputPosition} start - The starting position of the line.
   * @param {InputPosition} end - The ending position of the line.
   * @param {LineProps} [props=defaultLineProps] - The properties of the line.
   */
  constructor(
    start: InputPosition,
    end: InputPosition,
    { color = 0x000000, lineWidth = 4, arrowhead = false }: LineProps
  ) {
    super();
    this.start = start;
    this.end = end;
    this.arrowhead = arrowhead;

    this.material = new LineMaterial({
      color: color,
      linewidth: lineWidth,
      resolution: new Vector2(window.innerWidth, window.innerHeight),
      dashed: false,
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
      0,
      endPosition.x,
      endPosition.y,
      0,
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

  update(camera: OrthographicCamera) {
    this.updateGeometry(this.start, this.end, this.arrowhead, camera);
  }
}

export default Line;
