import { ArcCurve, CircleGeometry, MeshBasicMaterial, Vector2 } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { Component } from "./Component";
import Line from "./Primitives/Line";
import Text from "./Primitives/Text";

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
      radius,
      startAngle,
      endAngle,
      clockwise
    );
    //generate points on ArcCurve
    const points = arcCurve.getPoints(50);

    //punktene arcen krysser linjene
    const krysningAB = vectorBtoA.clone().normalize().multiplyScalar(radius);
    const krysningCB = vectorBtoC.clone().normalize().multiplyScalar(radius);

    // Create circle-geometry -- lager fyllet i vinkelen
    this.geometry = new CircleGeometry(radius, 32, startAngle, angle);
    this.material = new MeshBasicMaterial({ color: "#FAA307" });

    //setter posisjonen til å være fra punktB
    this.position.set(pointB.x, pointB.y, 0);

    //lage outline og tekst
    const vinkelTekst = new Text(
      (Math.round((angle * 180) / Math.PI) + " °").toString(),
      { fontSize: 18, anchorY: "middle", anchorX: "left", position: [15, 0] }
    );
    const linje1 = new Line(krysningAB, [0, 0], {
      lineWidth: 4,
      color: 0x080007,
    });
    const linje2 = new Line([0, 0], krysningCB, {
      lineWidth: 4,
      color: 0x080007,
    });
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

    //legger til outline og tekst
    this.add(vinkelTekst);
    this.add(linje1);
    this.add(linje2);
    this.add(linje3);
  }
}
export default Arc;
