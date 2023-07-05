import { OrthographicCamera, Vector3 } from "three";
import { toVector3 } from "../utils";
import Line, { LineOptions } from "./Line";
import { InputPosition } from "./types";

class InfiniteLine extends Line {
  constructor(start: InputPosition, end: InputPosition, props?: LineOptions) {
    super(start, end, props);
    this.frustumCulled = false;
  }

  _updateGeometry(camera: OrthographicCamera) {
    const left = camera.position.x + camera.left / camera.zoom;
    const right = camera.position.x + camera.right / camera.zoom;
    const top = camera.position.y + camera.top / camera.zoom;
    const bottom = camera.position.y + camera.bottom / camera.zoom;

    const startVec3 = toVector3(this.start);
    const endVec3 = toVector3(this.end);
    const dir = new Vector3().copy(endVec3).sub(startVec3).normalize();

    if (dir.x == 0 && dir.y == 0) return;

    const a = [Infinity, Infinity];
    const b = [Infinity, Infinity];
    if (dir.x != 0) {
      a[0] = (right - startVec3.x) / dir.x;
      b[0] = (left - startVec3.x) / dir.x;
    }
    if (dir.y != 0) {
      a[1] = (top - startVec3.y) / dir.y;
      b[1] = (bottom - startVec3.y) / dir.y;
    }

    const closestA = a.reduce((prev, curr) =>
      Math.abs(prev) < Math.abs(curr) ? prev : curr
    );
    const closestB = b.reduce((prev, curr) =>
      Math.abs(prev) < Math.abs(curr) ? prev : curr
    );

    this.geometry.attributes.instanceStart.setXYZ(
      0,
      startVec3.x + dir.x * closestA,
      startVec3.y + dir.y * closestA,
      0
    );

    this.geometry.attributes.instanceEnd.setXYZ(
      0,
      startVec3.x + dir.x * closestB,
      startVec3.y + dir.y * closestB,
      0
    );

    this.geometry.attributes.instanceStart.needsUpdate = true;
    this.geometry.attributes.instanceEnd.needsUpdate = true;
  }

  update(camera: OrthographicCamera) {
    this._updateGeometry(camera);
  }
}

export default InfiniteLine;
