import Grid from "./Components/Grid";
<<<<<<< HEAD
import InfiniteLine from "./Components/InfiniteLine";
=======
<<<<<<< HEAD
import Label from "./Components/Label";
>>>>>>> d98edc1 (Implement plot component using catmullrom3curve)
import Point from "./Components/Point";
=======
import Line from "./Components/Line";
import Plot from "./Components/Plot";
>>>>>>> b6fab2e (Implement plot component using catmullrom3curve)
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const point = new Point(0, 0, { draggable: "horizontal" });
graphica.add(point);

const line = new InfiniteLine([0, 0], [1, 0]);
graphica.add(line);

const grid = new Grid();
const a = new Plot(50, 2500, "sin(x)");
graphica.add(grid);
<<<<<<< HEAD

<<<<<<< HEAD
=======
const point = new Point(40, 30, {});
graphica.add(point);

const label = new Label({ text: "lab", start: [40, 30] });
graphica.add(label);

=======
graphica.add(a);
>>>>>>> b6fab2e (Implement plot component using catmullrom3curve)
>>>>>>> d98edc1 (Implement plot component using catmullrom3curve)
graphica.run();
