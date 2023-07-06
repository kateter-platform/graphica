import { GuiComponent } from "./interfaces";

type SliderOptions = {
  minValue: number;
  maxValue: number;
};

const defaultSliderOptions: SliderOptions = {
  minValue: -5,
  maxValue: 5,
};

class Slider implements GuiComponent {
  htmlElement: HTMLElement;
  observers: ((value: number) => void)[];

  constructor(options?: SliderOptions) {
    const { minValue, maxValue } = { ...defaultSliderOptions, ...options };

    const wrapper = document.createElement("div");
    wrapper.className = "slider-wrapper";
    this.htmlElement = wrapper;

    const input = document.createElement("input");
    input.type = "range";
    input.className = "slider";
    input.min = minValue.toString();
    input.max = maxValue.toString();
    input.step = ((maxValue - minValue) / 100).toString();
    input.value = ((maxValue + minValue) / 2).toString();

    this.observers = [];
    const handleInputChange = (event: Event) => {
      const value = parseFloat((event.target as HTMLInputElement).value);
      this.observers.forEach((observer) => observer(value));
    };
    input.addEventListener("input", handleInputChange);

    const edgeLeft = document.createElement("div");
    edgeLeft.className = "edge-left";

    const edgeRight = document.createElement("div");
    edgeRight.className = "edge-right";

    const serifLeft = document.createElement("div");
    serifLeft.className = "serif";

    const serifRight = document.createElement("div");
    serifRight.className = "serif";

    const textLeft = document.createElement("p");
    textLeft.className = "text";
    textLeft.textContent = minValue.toString();

    const textRight = document.createElement("p");
    textRight.className = "text";
    textRight.textContent = maxValue.toString();

    wrapper.appendChild(input);
    wrapper.appendChild(edgeLeft);
    wrapper.appendChild(edgeRight);
    edgeLeft.appendChild(serifLeft);
    edgeRight.appendChild(serifRight);
    edgeLeft.appendChild(textLeft);
    edgeRight.appendChild(textRight);
  }

  addObserver(observer: (value: number) => void) {
    this.observers.push(observer);
  }

  removeObserver(observer: (value: number) => void) {
    this.observers.splice(this.observers.indexOf(observer), 1);
  }
}

export default Slider;
