import {
  ArcCurve,
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Vector2,
} from "three";
import { Line2, LineMaterial } from "three-fatline";
import { toVector2, toVector3 } from "../utils";
import Text from "./Text";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

export type ArcOptions = {
  radius: number;
  hasLabel: boolean;
  color: number;
};

export const defaultArcOptions: ArcOptions = {
  radius: 40,
  hasLabel: true,
  color: 0xfaa307,
};

class Arc extends Component {
  pointA: InputPosition;
  pointB: InputPosition;
  pointC: InputPosition;
  radius: number;
  hasLabel: boolean;
  color: number;

  _arc: Mesh;
  _text: Text;
  _curvedOutline: Line2;

  constructor(
    pointA: InputPosition,
    pointB: InputPosition,
    pointC: InputPosition,
    options?: ArcOptions
  ) {
    super();

    const { radius, color, hasLabel } = {
      ...defaultArcOptions,
      ...options,
    };
    this.pointA = pointA;
    this.pointB = pointB;
    this.pointC = pointC;
    this.radius = radius;
    this.hasLabel = hasLabel;
    this.color = color;

    this._curvedOutline = new Line2(
      undefined,
      new LineMaterial({
        color: 0x080007,
        linewidth: 4,
        resolution: new Vector2(window.innerWidth, window.innerHeight),
      })
    );
    this.add(this._curvedOutline);

    this._arc = new Mesh(
      undefined,
      new MeshBasicMaterial({ color: this.color })
    );
    this.add(this._arc);

    this._text = new Text("0", {
      fontSize: this.hasLabel ? 20 : 0,
      anchorY: "middle",
      anchorX: "left",
      position: [0, 0],
    });
    this.add(this._text);

    const angle = this._calcAngle();
    this._updateOutline(angle, 1);
    this._updateArc(angle, 1);
    this._updateText(angle, 1);
  }

  _calcAngle() {
    const A = toVector2(this.pointA);
    const B = toVector2(this.pointB);
    const C = toVector2(this.pointC);

    const BA = A.sub(B);
    const BC = C.sub(B);

    let angle = BA.angle() - BC.angle();
    angle = angle < 0 ? angle + 2 * Math.PI : angle;
    return angle;
  }

  _calcVectorAngle(point1: InputPosition, point2: InputPosition) {
    const vector = toVector2(point2).sub(toVector2(point1));
    return Math.atan2(vector.y, vector.x);
  }

  _updateArc(angle: number, cameraZoom: number) {
    this._arc.geometry.dispose();

    const B = toVector2(this.pointB);
    const C = toVector2(this.pointC);
    const BC = C.sub(B);
    const startAngle = BC.angle();

    this._arc.geometry = new CircleGeometry(
      this.radius / cameraZoom,
      64,
      startAngle,
      angle
    );
    this._arc.geometry.computeVertexNormals();
  }

  _updateOutline(angle: number, cameraZoom: number) {
    const B = toVector2(this.pointB);
    const C = toVector2(this.pointC);
    const BC = C.sub(B);
    const startAngle = BC.angle();
    const endAngle = startAngle + angle;

    const arcCurve = new ArcCurve(
      0,
      0,
      this.radius / cameraZoom,
      startAngle,
      endAngle,
      false
    );

    const points = arcCurve.getPoints(50);
    this._curvedOutline.geometry.setPositions(
      points.flatMap((v) => [v.x, v.y, 3])
    );
  }

  _updateText(angle: number, cameraZoom: number) {
    this._text.setText(Math.round((angle * 180) / Math.PI).toString() + "°");
    this._text.position.set(
      (-60 / cameraZoom) * 1.75,
      0,
      this._text.position.z
    );
  }

  public getAngle(unit = "radians"): number {
    if (unit === "degrees") {
      return this._calcAngle() * (180 / Math.PI);
    }
    return this._calcAngle();
  }

  update(camera: OrthographicCamera) {
    const pointBVec = toVector3(this.pointB);
    this.position.set(pointBVec.x, pointBVec.y, this.position.z);

    const angle = this._calcAngle();
    this._updateOutline(angle, camera.zoom);
    this._updateArc(angle, camera.zoom);
    this._updateText(angle, camera.zoom);
  }
}

export default Arc;
