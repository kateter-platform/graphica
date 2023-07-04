import { ArcCurve, MeshBasicMaterial, Shape, Vector2 } from "three";
import Line from "./Line";
import Point from "./Point";
import { Component } from "./interfaces";

type ArcOptions = {
  pointA: Vector2;
  pointB: Vector2;
  pointC: Vector2;
  radius: number;
};

class Arc extends Component {
  constructor({ pointA, pointB, pointC, radius = 20 }: ArcOptions) {
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
    //fyllet på toppen
    const toppen = new Shape();
    toppen.absarc(pointB.x, pointB.y, radius, startAngle, endAngle, false);

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

    //fyllet til trekanten
    const trekanten = new Shape();
    trekanten.moveTo(pointB.x, pointB.y);
    trekanten.lineTo(krysningAB.x, krysningAB.y);
    trekanten.lineTo(krysningCB.x, krysningCB.y);
    trekanten.lineTo(pointB.x, pointB.y);

    //lage linjer og shapes som fyll
    const vinkelTekst = new Text(
      (Math.round((angle * 180) / Math.PI) + " °").toString()
    );
    const punkt = new Point(pointB.x, pointB.y, {});
    const linje1 = new Line(krysningAB, pointB, { lineWidth: 2 });
    const linje2 = new Line(pointB, krysningCB, { lineWidth: 2 });
    // const linje3 = new Line(points);
    // const topp = new ShapGeometry(args:[toppen], new MeshBasicMaterial(color:"#FAA307"))
    // const trekant = new ShapBufferGeometry(args:[trekanten], new MeshBasicMaterial(color:"#FAA307"))

    // this.add(vinkelTekst);
    this.add(punkt);
    this.add(linje1);
    this.add(linje2);
    // this.add(linje3);
    // this.add(topp);
    // this.add(trekant)
  }
}
export default Arc;
