import {
  ArcCurve,
  CircleGeometry,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Vector2,
} from "three";
import { Line2, LineMaterial } from "three-fatline";
import { toVector3 } from "../utils";
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
  _side1Outline: Line;
  _side2Outline: Line;

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

    this._side1Outline = new Line([0, 0], [0, 0], {
      lineWidth: 4,
      color: 0x080007,
    });
    this._side2Outline = new Line([0, 0], [0, 0], {
      lineWidth: 4,
      color: 0x080007,
    });
    this._curvedOutline = new Line2(
      undefined,
      new LineMaterial({
        color: 0x080007,
        linewidth: 4,
        resolution: new Vector2(window.innerWidth, window.innerHeight),
      })
    );
    this.add(this._side1Outline);
    this.add(this._side2Outline);
    this.add(this._curvedOutline);

    this._arc = new Mesh(undefined, new MeshBasicMaterial({ color: color }));
    this.add(this._arc);

    this._text = new Text("0", {
      fontSize: hasLabel ? 20 : 0,
      anchorY: "middle",
      anchorX: "left",
      position: [0, 0],
    });
    this.add(this._text);

    const angle = this._calcAngle();
    this._updateOutline(angle);
    this._updateArc(angle);
  }

  update(camera: OrthographicCamera) {
    const pointBVec = toVector3(this.pointB);
    this.position.set(pointBVec.x, pointBVec.y, 0);

    const angle = this._calcAngle();
    this._updateOutline(angle, camera.zoom);
    this._updateArc(angle, camera.zoom);
    this._updateText(angle, camera.zoom);
  }

  _calcAngle() {
    const pointAvec3 = toVector3(this.pointA);
    const pointBvec3 = toVector3(this.pointB);
    const pointCvec3 = toVector3(this.pointC);
    const vectorBtoA = pointAvec3.clone().sub(pointBvec3.clone());
    const vectorBtoC = pointCvec3.clone().sub(pointBvec3.clone());
    return vectorBtoA.angleTo(vectorBtoC);
  }

  _updateOutline(angle: number, cameraZoom = 1) {
    const pointAvec3 = toVector3(this.pointA);
    const pointBvec3 = toVector3(this.pointB);
    const pointCvec3 = toVector3(this.pointC);
    const vectorBtoA = pointAvec3.clone().sub(pointBvec3.clone());
    const vectorBtoC = pointCvec3.clone().sub(pointBvec3.clone());

    //finner hvilken vinkel som er riktig
    const angle1 =
      (Math.atan2(vectorBtoA.y, vectorBtoA.x) + Math.PI * 2) % (Math.PI * 2);
    const angle2 =
      (Math.atan2(vectorBtoC.y, vectorBtoC.x) + Math.PI * 2) % (Math.PI * 2);

    let startAngle = angle2; // Starting angle of the arc in radians

    if (
      (angle1 - angle2 + Math.PI * 2) % (2 * Math.PI) >
      (angle2 - angle1 + Math.PI * 2) % (2 * Math.PI)
    ) {
      startAngle = angle1;
    }
    const endAngle = startAngle + angle; // Ending angle of the arc in radians
    const clockwise = false; // Whether the arc is drawn in a clockwise direction

    //Create Arc-curve
    const arcCurve = new ArcCurve(
      0,
      0,
      this.radius / cameraZoom,
      startAngle,
      endAngle,
      clockwise
    );
    //generate points on ArcCurve
    const points = arcCurve.getPoints(50);
    this._curvedOutline.geometry.setPositions(
      points.flatMap((v) => [v.x, v.y, 3])
    );

    //punktene arcen krysser linjene
    const krysningAB = vectorBtoA
      .clone()
      .normalize()
      .multiplyScalar(this.radius / cameraZoom);
    const krysningCB = vectorBtoC
      .clone()
      .normalize()
      .multiplyScalar(this.radius / cameraZoom);

    this._side1Outline.start = new Vector2(krysningAB.x, krysningAB.y);
    this._side2Outline.start = new Vector2(krysningCB.x, krysningCB.y);
  }

  _updateArc(angle: number, cameraZoom = 1) {
    const pointAvec3 = toVector3(this.pointA);
    const pointBvec3 = toVector3(this.pointB);
    const pointCvec3 = toVector3(this.pointC);
    const vectorBtoA = pointAvec3.clone().sub(pointBvec3.clone());
    const vectorBtoC = pointCvec3.clone().sub(pointBvec3.clone());

    //finner hvilken vinkel som er riktig
    const angle1 =
      (Math.atan2(vectorBtoA.y, vectorBtoA.x) + Math.PI * 2) % (Math.PI * 2);
    const angle2 =
      (Math.atan2(vectorBtoC.y, vectorBtoC.x) + Math.PI * 2) % (Math.PI * 2);

    let startAngle = angle2; // Starting angle of the arc in radians

    if (
      (angle1 - angle2 + Math.PI * 2) % (2 * Math.PI) >
      (angle2 - angle1 + Math.PI * 2) % (2 * Math.PI)
    ) {
      startAngle = angle1;
    }

    // Create circle-geometry -- lager fyllet i vinkelen
    this._arc.geometry.dispose();
    this._arc.geometry = new CircleGeometry(
      this.radius / cameraZoom,
      32,
      startAngle,
      angle
    );
    this._arc.geometry.computeVertexNormals();
  }

  _updateText(angle: number, cameraZoom: number) {
    this._text.setText(Math.round((angle * 180) / Math.PI).toString() + " °");
    this._text.position.set(-60 / cameraZoom, 0, this._text.position.z);
  }
}
export default Arc;
