import Grid from "./Components/Grid";
import Text from "./Components/Text";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();
graphica.add(grid);
graphica.add(new Text("test", {}));

graphica.run();
