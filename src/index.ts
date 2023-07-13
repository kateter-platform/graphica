import Arc from "./Components/Arc";
import Bracket from "./Components/Bracket";
import Button from "./Components/Button";
import Circle from "./Components/Circle";
import Grid from "./Components/Grid";
import InputField from "./Components/InputField";
import Point from "./Components/Point";
import Slider from "./Components/Slider";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();

const punkt1 = new Point(70, 70, {
  draggable: "unrestricted",
  color: "#F4493B",
});
const punkt2 = new Point(50, 50, { draggable: "unrestricted" });
const punkt3 = new Point(40, 40, {
  draggable: "unrestricted",
  color: "#F4493B",
});
const arc = new Arc(punkt1, punkt2, punkt3);

const bracket = new Bracket("Bracket", punkt1, punkt2);
graphica.add(bracket);

const slider = new Slider();
graphica.addGui(slider);

slider.addObserver((value) => {
  console.log(value);
});

const button = new Button({ label: "KnappKnappKnappKnappKnapp" });
graphica.addGui(button);

button.addObserver(() => {
  console.log("12345");
});

const inputfield = new InputField();
graphica.addGui(inputfield);

inputfield.addObserver((value) => {
  console.log(value);
});

const circle = new Circle(30, 20, 10);
graphica.add(circle);

graphica.add(punkt1);
graphica.add(punkt2);
graphica.add(punkt3);
graphica.add(arc);
graphica.add(grid);
graphica.run();
