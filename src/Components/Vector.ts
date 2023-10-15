import { Vector2, OrthographicCamera } from "three";
import { toVector2, toVector3 } from "./../utils";
import Line from "./Line";
import { Draggable } from "./interfaces";
import { InputPosition } from "./types";

const defaultVectorOptions = {
  color: 0x000000,
  normalize: true,
  draggable: undefined,
};

export type VectorOptions = {
  color?: number;
  normalize?: boolean;
  draggable?: Draggable;
};

class Vector extends Line {
  private vector: InputPosition;

  constructor(
    origin: InputPosition,
    vector: InputPosition,
    options?: VectorOptions
  ) {
    const { color, normalize, draggable } = {
      ...defaultVectorOptions,
      ...options,
    };
    super(origin, origin, {
      lineWidth: 4,
      arrowhead: true,
      color: color,
      draggable: draggable,
    });
    if (normalize) {
      this.vector = toVector2(vector).normalize();
    } else {
      this.vector = toVector2(vector);
    }
  }

  calculateEndPoint(position: InputPosition, vector: Vector2) {
    const pos = toVector3(position);
    return new Vector2(pos.x + vector.x, pos.y + vector.y);
  }

  //We need to handle getters and setters for this better soon to not overwrite it all the time.

  public setAngleVector(position: InputPosition) {
    this.vector = position;
  }

  public setNormalizedAngleVector(position: InputPosition) {
    this.vector = toVector2(position).normalize();
  }

  public setOriginPoint(position: InputPosition) {
    this.start = position;
  }

  public getOriginPoint(): InputPosition {
    return this.start;
  }

  public normalize(): void {
    this.vector = toVector2(this.vector).normalize();
  }

  public getAngle(): number {
    return toVector2(this.vector).angle();
  }

  public getX(): number {
    return toVector2(this.vector).x;
  }

  public getY(): number {
    return toVector2(this.vector).y;
  }

  public getNormalizedX(): number {
    return toVector2(this.vector).normalize().x;
  }

  public getNormalizedY(): number {
    return toVector2(this.vector).normalize().y;
  }

  update(camera: OrthographicCamera) {
    this.end = this.calculateEndPoint(this.start, toVector2(this.vector));
    this.updateGeometry(this.start, this.end, this.arrowhead, camera);
  }
}

export default Vector;
