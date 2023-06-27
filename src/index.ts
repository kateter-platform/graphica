import Grid from "./Components/Grid";
import Point from "./Components/Point";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();
graphica.add(grid);
const point = new Point();
graphica.add(point);

graphica.run();
