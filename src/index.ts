import Grid from "./Components/Grid";
import Latex from "./Components/Latex";
import SVG from "./Components/SVGLoader";
import Graphica from "./Graphica";

const graphica = new Graphica();

const grid = new Grid();

const a = new SVG("../public/images/Funksjonsmaskin 2.svg");

const b = new Latex('" \\pi ^ 2 = g "', { position: [800, 250] });
const c = new Latex("- Kato", { position: [800, 190], fontSize: 35 });

graphica.add(b);
graphica.add(c);

graphica.add(a);
graphica.add(grid);
graphica.run();
