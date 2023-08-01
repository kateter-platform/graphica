import { Vector2, OrthographicCamera } from "three";
import { toVector2, toVector3 } from "./../utils";
import Line from "./Line";
import { InputPosition } from "./types";

export type VectorProps = {
  color?: number;
};

class Vector extends Line {
  vector: InputPosition;

  constructor(position: InputPosition, vector: InputPosition, {}: VectorProps) {
    super(position, position, { lineWidth: 4, arrowhead: true });
    this.vector = vector;
  }

  calculateEndPoint(position: InputPosition, vector: Vector2) {
    const pos = toVector3(position);
    return new Vector2(pos.x + vector.x, pos.y + vector.y);
  }

  update(camera: OrthographicCamera) {
    this.end = this.calculateEndPoint(this.start, toVector2(this.vector));
    this.updateGeometry(this.start, this.end, this.arrowhead, camera);
  }
}

export default Vector;
