import Grid from "./Components/Grid";
import InfiniteLine from "./Components/InfiniteLine";
import Point from "./Components/Point";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const point = new Point(0, 0, { draggable: "horizontal" });
graphica.add(point);

const line = new InfiniteLine([0, 0], [1, 0]);
graphica.add(line);

const grid = new Grid();
const a = new Plot();
graphica.add(a);
graphica.add(grid);

graphica.run();
