import Grid from "./Components/Grid";
<<<<<<< HEAD
import Point from "./Components/Point";
=======
import Line from "./Components/Line";
>>>>>>> 464899e (Implement line component)
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();
graphica.add(grid);
<<<<<<< HEAD
const point = new Point();
graphica.add(point);

=======
graphica.add(new Line([0, 0], [10, -10]));
>>>>>>> 464899e (Implement line component)
graphica.run();
