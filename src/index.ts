import Grid from "./Components/Grid";
import Label from "./Components/Label";
import Point from "./Components/Point";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();
graphica.add(grid);

const point = new Point(40, 30, {});
graphica.add(point);

const label = new Label({ text: "lab", start: [40, 30] });
graphica.add(label);

graphica.run();
