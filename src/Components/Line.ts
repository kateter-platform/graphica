import {
  Vector2,
  OrthographicCamera,
  Event,
  Object3D,
  Box3,
  Vector3,
  CubicBezierCurve,
} from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { toVector2 } from "../utils";
import { Collider, Component, Draggable } from "./interfaces";
import { InputPosition } from "./types";
import Text from "./Text"

const ARROWHEAD_LENGTH = 12;

export type LineOptions = {
  color?: number;
  lineWidth?: number;
  arrowhead?: boolean;
  dashed?: boolean;
  opacity?: number;
  transparent?: boolean;
  draggable?: Draggable;
  curve?: number;
  label?: string;
};

export const defaultLineOptions: LineOptions = {
  color: 0x080007,
  lineWidth: 4,
  arrowhead: false,
  dashed: false,
  opacity: 1,
  transparent: false,
  draggable: undefined,
  curve: 0,
  label: "",
};

class Line extends Component implements Collider {
  start: InputPosition;
  end: InputPosition;
  arrowhead: boolean;
  curve: number;
  label: Text;

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
      curve,
      label,
    } = {
      ...defaultLineOptions,
      ...options,
    };
    this.start = start;
    this.end = end;
    this.arrowhead = arrowhead ?? false;
    this.curve = curve ?? 0;
    this.label = new Text(label, {fontSize: 2.5, anchorX: "center", anchorY: "middle", responsiveScale: false});
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

    let direction:Vector2;
    if (this.curve == 0) {
      direction = startPosition.clone().sub(endPosition).normalize();

      (this.geometry as LineGeometry).setPositions([
        startPosition.x,
        startPosition.y,
        this.position.z,
        endPosition.x,
        endPosition.y,
        this.position.z,
      ]);
    } else {
      const curvePoints = this.getCurvePoints(startPosition, endPosition);
      direction = curvePoints[49].clone().sub(curvePoints[50]).normalize();

      (this.geometry as LineGeometry).setPositions(
        curvePoints.flatMap(point => [point.x, point.y, this.position.z])
      );
    }

    // Computation made in order to get label in the correct position
    const midPoint = new Vector2(startPosition.x+(endPosition.x-startPosition.x)/2, startPosition.y+(endPosition.y-startPosition.y)/2);
    const dir = midPoint.clone().sub(startPosition).normalize();
    let normal:Vector2;
    if (this.arrowhead) {
      normal = new Vector2(-dir.y, dir.x).normalize().multiplyScalar(this.curve).multiplyScalar(1.1);
    } else {
      normal = new Vector2(-dir.y, dir.x).normalize().multiplyScalar(1.1);
    }
    const labelPoint = midPoint.clone().add(normal);
    this.label.setPosition([labelPoint.x, labelPoint.y]);

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

    if (this.curve == 0) {
      (this.geometry as LineGeometry).setPositions([
        startPosition.x,
        startPosition.y,
        this.position.z,
        endPosition.x,
        endPosition.y,
        this.position.z,
      ]);
    } else {
      const curvePoints = this.getCurvePoints(startPosition, endPosition);
  
      (this.geometry as LineGeometry).setPositions(
        curvePoints.flatMap(point => [point.x, point.y, this.position.z])
      );
    }

    // Computation made in order to get label in the correct position
    const midPoint = new Vector2(startPosition.x+(endPosition.x-startPosition.x)/2, startPosition.y+(endPosition.y-startPosition.y)/2);
    const direction = midPoint.clone().sub(startPosition).normalize();
    let normal:Vector2;
    this.label
    if (this.arrowhead) {
      normal = new Vector2(-direction.y, direction.x).normalize().multiplyScalar(this.curve).multiplyScalar(1.1);
    } else {
      normal = new Vector2(-direction.y, direction.x).normalize().multiplyScalar(1.1);
    }
    const labelPoint = midPoint.clone().add(normal);
    this.label.setPosition([labelPoint.x, labelPoint.y]);
    this.add(this.label);
  }

  /**
   * Help function for to curved lines
   */
  private getCurvePoints(start: Vector2, end: Vector2): Vector2[] {
    const point1 = start.clone().lerp(end, 0.25);
    const point2 = start.clone().lerp(end, 0.75);

    const direction1 = point1.clone().sub(start).normalize();
    const direction2 = end.clone().sub(point2).normalize();

    const normal1 = new Vector2(-direction1.y, direction1.x).normalize().multiplyScalar(this.curve);
    const normal2 = new Vector2(-direction2.y, direction2.x).normalize().multiplyScalar(this.curve);

    const controlPoint1 = point1.clone().add(normal1);
    const controlPoint2 = point2.clone().add(normal2);

    const curve = new CubicBezierCurve(start, controlPoint1, controlPoint2, end);
    return curve.getPoints(50);
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

  public setZIndex(z: number): void {
    this.position.setZ(z - 3);
  }

  public setCurve(curve: number): void {
    this.curve = curve;
  }

  public setLabel(label: string): void {
    this.label.setText(label);
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
