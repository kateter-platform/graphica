import { OrthographicCamera, Vector3 } from "three";
import { Line2 } from "three-fatline";
import Line, { LineProps, defaultLineProps } from "./Line";
import { InputPosition } from "./types";

class InfiniteLine extends Line {
  constructor(
    start: InputPosition = [0, 0],
    end: InputPosition = [0, 0],
    props: LineProps = defaultLineProps
  ) {
    super(start, end, props);
    this.object.frustumCulled = false;
  }

  update(camera: OrthographicCamera) {
    const left = camera.position.x + camera.left / camera.zoom;
    const right = camera.position.x + camera.right / camera.zoom;
    const top = camera.position.y + camera.top / camera.zoom;
    const bottom = camera.position.y + camera.bottom / camera.zoom;

    const dir = new Vector3().copy(this.end).sub(this.start).normalize();

    if (dir.x == 0 && dir.y == 0) return;

    const a = [Infinity, Infinity];
    const b = [Infinity, Infinity];
    if (dir.x != 0) {
      a[0] = (right - this.start.x) / dir.x;
      b[0] = (left - this.start.x) / dir.x;
    }
    if (dir.y != 0) {
      a[1] = (top - this.start.y) / dir.y;
      b[1] = (bottom - this.start.y) / dir.y;
    }

    const closestA = a.reduce((prev, curr) =>
      Math.abs(prev) < Math.abs(curr) ? prev : curr
    );
    const closestB = b.reduce((prev, curr) =>
      Math.abs(prev) < Math.abs(curr) ? prev : curr
    );

    (this.object as Line2).geometry.attributes.instanceStart.setXYZ(
      0,
      this.start.x + dir.x * closestA,
      this.start.y + dir.y * closestA,
      0
    );

    (this.object as Line2).geometry.attributes.instanceEnd.setXYZ(
      0,
      this.start.x + dir.x * closestB,
      this.start.y + dir.y * closestB,
      0
    );

    (this.object as Line2).geometry.attributes.instanceStart.needsUpdate = true;
    (this.object as Line2).geometry.attributes.instanceEnd.needsUpdate = true;
  }
}

export default InfiniteLine;
