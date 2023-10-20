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
import Line from "./Line";
import Text from "./Text";
import { Component } from "./interfaces";
import { InputPosition } from "./types";

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
    radius = 40,
    hasLabel = true,
    color = 0xfaa307
  ) {
    super();
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
    const pointAvec2 = toVector2(this.pointA);
    const pointBvec2 = toVector2(this.pointB);
    const pointCvec2 = toVector2(this.pointC);

    const vectorBtoA = pointAvec2.clone().sub(pointBvec2);
    const vectorBtoC = pointCvec2.clone().sub(pointBvec2);

    const dot = vectorBtoA.dot(vectorBtoC);
    const det = vectorBtoA.x * vectorBtoC.y - vectorBtoA.y * vectorBtoC.x;
    let angle = Math.atan2(det, dot);

    // Normalize the angle to be between 0 and 2π
    while (angle < 0) angle += 2 * Math.PI;
    while (angle > 2 * Math.PI) angle -= 2 * Math.PI;

    return angle;
  }

  _updateOutline(angle: number, cameraZoom: number) {
    const startAngle = 0;
    const endAngle = angle;
    const clockwise = false;

    // Create Arc-curve
    const arcCurve = new ArcCurve(
      0,
      0,
      (this.radius / cameraZoom) * 10,
      startAngle,
      endAngle,
      clockwise
    );
    // Generate points on ArcCurve
    const points = arcCurve.getPoints(50);
    this._curvedOutline.geometry.setPositions(
      points.flatMap((v) => [v.x, v.y, 3])
    );
  }

  _updateArc(angle: number, cameraZoom: number) {
    this._arc.geometry.dispose();
    this._arc.geometry = new CircleGeometry(
      (this.radius / cameraZoom) * 10,
      64,
      0,
      angle
    );
    this._arc.geometry.computeVertexNormals();
  }

  _updateText(angle: number, cameraZoom: number) {
    this._text.setText(Math.round((angle * 180) / Math.PI).toString() + "°");
    this._text.position.set((-60 / cameraZoom) * 2, 0, this._text.position.z);
  }

  public getAngle(unit = "radians"): number {
    if (unit === "degrees") {
      return this._calcAngle() * (180 / Math.PI);
    }
    return this._calcAngle();
  }

  update(camera: OrthographicCamera) {
    const pointBVec = toVector3(this.pointB);
    this.position.set(pointBVec.x, pointBVec.y, 0);

    const angle = this._calcAngle();
    this._updateOutline(angle, camera.zoom);
    this._updateArc(angle, camera.zoom);
    this._updateText(angle, camera.zoom);
  }
}

export default Arc;
