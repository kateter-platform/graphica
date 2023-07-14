import { Vector2 } from "three";
import Button from "./Components/Button";
import Circle from "./Components/Circle";
import Grid from "./Components/Grid";
import InputField from "./Components/InputField";
import Shape from "./Components/Shape";
import Slider from "./Components/Slider";
import Graphica from "./Graphica";

const graphica = new Graphica(document.body);

const grid = new Grid();

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

const shape = new Shape(
  [
    new Vector2(5, 20),
    new Vector2(20, 20),
    new Vector2(20, 5),
    new Vector2(5, 5),
  ],
  { color: 0x5603ad }
);
const shape2 = new Shape([
  new Vector2(30, 25),
  new Vector2(30, 40),
  new Vector2(40, 30),
]);
graphica.add(shape);
graphica.add(shape2);


graphica.add(grid);
graphica.run();
