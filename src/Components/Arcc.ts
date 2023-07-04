import { ArcCurve, CircleGeometry, MeshBasicMaterial, Vector2 } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import Line from "./Line";
import Text from "./Text";
import { Component } from "./interfaces";

type ArccOptions = {
  pointA: Vector2;
  pointB: Vector2;
  pointC: Vector2;
  radius: number;
};

class Arcc extends Component {
  constructor({ pointA, pointB, pointC, radius = 20 }: ArccOptions) {
    super();
    //finne linjene i vinkelen og den minste vinkelen mellom de
    const vectorBtoA = pointA.clone().sub(pointB.clone());
    const vectorBtoC = pointC.clone().sub(pointB.clone());
    const angle = vectorBtoA.angleTo(vectorBtoC);
    //finner riktig vinkel
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
      radius,
      startAngle,
      endAngle,
      clockwise
    );
    //generate points on ArcCurve
    const points = arcCurve.getPoints(50);
    for (let i = 0; i < points.length; i++) {
      points[i].add(new Vector2(pointB.x, pointB.y));
    }
    //punktene arcen krysser linjene
    const krysningAB = vectorBtoA
      .clone()
      .normalize()
      .multiplyScalar(radius)
      .add(pointB);

    const krysningCB = vectorBtoC
      .clone()
      .normalize()
      .multiplyScalar(radius)
      .add(pointB);

    // Create circle-geometry
    // this.geometry = new CircleGeometry(radius, 32, startAngle, angle);
    // this.material = new MeshBasicMaterial({ color: "#FAA307" });

    this.position.set(pointB.x, pointB.y, 0);

    //lage linjer og shapes som fyll
    const vinkelTekst = new Text(
      (Math.round((angle * 180) / Math.PI) + " °").toString(),
      {}
    );
    const linje1 = new Line([0, 0], [10, 0], { lineWidth: 4 });
    const linje2 = new Line(pointB, krysningCB, { lineWidth: 4 });
    const tempLine = new LineGeometry().setFromPoints(points);
    const linje3 = new Line2(tempLine, new LineMaterial({ color: 0x080007 }));

    this.add(vinkelTekst);
    this.add(linje1);
    this.add(linje2);
    this.add(linje3);
  }
}
export default Arcc;
