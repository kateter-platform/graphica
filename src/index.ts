import Grid from "./Components/Grid";
import Label from "./Components/Label";
import Plot from "./Components/Plot";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();
const a = new Plot("sin(x)", {});

graphica.add(grid);

const label = new Label({ text: "lab", start: [40, 30] });
graphica.add(label);

graphica.add(a);
graphica.run();
