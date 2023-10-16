import {
  Vector2,
  OrthographicCamera,
  Event,
  Object3D,
  Box3,
  Vector3,
} from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { toVector2 } from "../utils";
import { Collider, Component, Draggable } from "./interfaces";
import { InputPosition } from "./types";

const ARROWHEAD_LENGTH = 12;

export type LineOptions = {
  color?: number;
  lineWidth?: number;
  arrowhead?: boolean;
  dashed?: boolean;
  opacity?: number;
  transparent?: boolean;
  draggable?: Draggable;
};

export const defaultLineOptions: LineOptions = {
  color: 0x080007,
  lineWidth: 4,
  arrowhead: false,
  dashed: false,
  opacity: 1,
  transparent: false,
  draggable: undefined,
};

class Line extends Component implements Collider {
  start: InputPosition;
  end: InputPosition;
  arrowhead: boolean;

  constructor(start: InputPosition, end: InputPosition, options?: LineOptions) {
    super();
    const {
      color,
      lineWidth,
      arrowhead,
      dashed,
      opacity,
      transparent,
      draggable,
    } = {
      ...defaultLineOptions,
      ...options,
    };
    this.start = start;
    this.end = end;
    this.arrowhead = arrowhead ?? false;
    this.material = new LineMaterial({
      color: color,
      linewidth: lineWidth,
      resolution: new Vector2(window.innerWidth, window.innerHeight),
      dashed: dashed,
      opacity: opacity,
      transparent: transparent,
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
    this.initialUpdateGeometry(start, end);
    this.draggable = draggable;
  }

  collidesWith(other: Object3D): boolean {
    const box1 = new Box3().setFromObject(this);
    const box2 = new Box3().setFromObject(other);

    // Set Z-coordinates to 0 for both boxes
    box1.min.z = 0;
    box1.max.z = 0;
    box2.min.z = 0;
    box2.max.z = 0;

    return box1.intersectsBox(box2);
  }

  distanceTo(other: Object3D<Event>): number {
    const box1 = new Box3().setFromObject(this);
    const box2 = new Box3().setFromObject(other);

    const center1 = new Vector3();
    const center2 = new Vector3();
    box1.getCenter(center1);
    box2.getCenter(center2);
    center1.setZ(0);
    center2.setZ(0);

    return center1.distanceTo(center2);
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
      1.1,
      endPosition.x,
      endPosition.y,
      1.1,
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

  private initialUpdateGeometry(start: InputPosition, end: InputPosition) {
    const startPosition = toVector2(start);
    const endPosition = toVector2(end);

    (this.geometry as LineGeometry).setPositions([
      startPosition.x,
      startPosition.y,
      1.1,
      endPosition.x,
      endPosition.y,
      1.1,
    ]);
  }

  public setEnd(end: InputPosition) {
    this.end = end;
  }

  public setStart(start: InputPosition) {
    this.start = start;
  }

  public setPosition(start: InputPosition, end: InputPosition) {
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
