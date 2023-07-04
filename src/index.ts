import Grid from "./Components/Grid";
import Line from "./Components/Line";
import Plot from "./Components/Plot";
import Point from "./Components/Point";
import Text from "./Components/Text";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();
const point = new Point(10, 10, { label: true, draggable: "unrestricted" });
const line = new Line([0, 0], point, { color: 0x000000, lineWidth: 4 });
const text = new Text("Hello World this is awesome!", {
  position: [0, 10],
  color: "black",
  fontSize: 10,
  anchorX: "left",
  anchorY: "bottom",
});
const a = new Plot("sin(x)", {});
const b = new Line([0, 0], [50, 50], { color: 0x000000 });
graphica.add(a);
graphica.add(b);
graphica.add(grid);
graphica.add(line);
graphica.add(point);
graphica.add(text);

graphica.run();
