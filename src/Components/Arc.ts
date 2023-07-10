import {
  ArcCurve,
  CircleGeometry,
  Group,
  MeshBasicMaterial,
  OrthographicCamera,
  Vector2,
} from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
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
  angle: number;
  constructor(
    pointA: InputPosition,
    pointB: InputPosition,
    pointC: InputPosition,
    radius = 20
  ) {
    super();
    this.pointA = pointA;
    this.pointB = pointB;
    this.pointC = pointC;
    this.radius = radius;

    const pointAvec3 = toVector3(pointA);
    const pointBvec3 = toVector3(pointB);
    const pointCvec3 = toVector3(pointC);
    const vectorBtoA = pointAvec3.clone().sub(pointBvec3.clone());
    const vectorBtoC = pointCvec3.clone().sub(pointBvec3.clone());
    const angle = vectorBtoA.angleTo(vectorBtoC);
    this.angle = angle;

    const outline = this.createOutline();
    this.add(outline);
    const arcText = this.createAngleText(this.angle);
    this.add(arcText);
    const arc = this.createArc();
    this.add(arc);
  }

  update(camera: OrthographicCamera) {
    //bruker ikke camera, trenger jeg denne i det hele tatt?
    this.removeLines();

    const outline = this.createOutline();
    this.add(outline);
    const arcText = this.createAngleText(this.angle);
    this.add(arcText);
    const arc = this.createArc();
    this.add(arc);
  }
  removeLines() {
    this.children.forEach((child) => {
      this.remove(child);
    });
  }

  createOutline() {
    const lines = new Group();

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
    const endAngle = startAngle + this.angle; // Ending angle of the arc in radians
    const clockwise = false; // Whether the arc is drawn in a clockwise direction

    //Create Arc-curve
    const arcCurve = new ArcCurve(
      0,
      0,
      this.radius,
      startAngle,
      endAngle,
      clockwise
    );
    //generate points on ArcCurve
    const points = arcCurve.getPoints(50);

    //punktene arcen krysser linjene
    const krysningAB = vectorBtoA
      .clone()
      .normalize()
      .multiplyScalar(this.radius);
    const krysningCB = vectorBtoC
      .clone()
      .normalize()
      .multiplyScalar(this.radius);

    const linje1 = new Line(new Vector2(krysningAB.x, krysningAB.y), [0, 0], {
      lineWidth: 4,
      color: 0x080007,
    });
    lines.add(linje1);
    const linje2 = new Line([0, 0], new Vector2(krysningCB.x, krysningCB.y), {
      lineWidth: 4,
      color: 0x080007,
    });
    lines.add(linje2);
    const tempLine = new LineGeometry();
    tempLine.setPositions(points.flatMap((v) => [v.x, v.y, 3]));
    const linje3 = new Line2(
      tempLine,
      new LineMaterial({
        color: 0x080007,
        linewidth: 4,
        resolution: new Vector2(window.innerWidth, window.innerHeight),
      })
    );
    lines.add(linje3);
    return lines;
  }

  createArc() {
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
    this.geometry = new CircleGeometry(this.radius, 32, startAngle, this.angle);
    this.material = new MeshBasicMaterial({ color: "#FAA307" });
    //setter posisjonen til å være fra punktB
    this.position.set(pointBvec3.x, pointBvec3.y, 0);

    return this; //hvordan setter jeg this til å være hele circlegeometrien
  }

  createAngleText(angle: number) {
    const vinkelTekst = new Text(
      (Math.round((angle * 180) / Math.PI) + " °").toString(),
      { fontSize: 18, anchorY: "middle", anchorX: "left", position: [15, 0] }
    );
    return vinkelTekst;
  }
}
export default Arc;
