import Circle from "./Components/Circle";
import Grid from "./Components/Grid";
import Line from "./Components/Line";
import Plot from "./Components/Plot";
import Point from "./Components/Point";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();

const p = new Plot("sin(x)", { plotBetween: [0, 10] });
const s = new Circle(-3, 0, 1);
const p2 = new Point(-3, 0);
const p3 = new Point(0, 0);
const a = new Line([-3, 0], [-2, 0]);
const b = new Line(p2, p3, { dashed: true, color: 0xa1a1a1 });
const c = new Line([-3, 0], p2);

graphica.add(p2);
graphica.add(s);
graphica.add(p);
graphica.add(p3);
graphica.add(grid);
graphica.add(a);
graphica.add(b);
graphica.add(c);
graphica.run((deltatime): void => {
  p.setExpression(`sin(x + ${deltatime})`);
  p2.position.set(-3, Math.sin(0 + deltatime), p2.position.z);
  p3.position.set(0, Math.sin(0 + deltatime), p2.position.z);
  a.setEnd([-3 + Math.cos(deltatime), Math.sin(deltatime)]);
  c.setStart([-3 + Math.cos(deltatime), Math.sin(deltatime)]);
});
