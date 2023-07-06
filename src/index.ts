import Grid from "./Components/Grid";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid({ yLabelText: "y", xLabelText: "x" });

graphica.add(grid);
graphica.run();
