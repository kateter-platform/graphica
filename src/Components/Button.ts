import { GuiComponent } from "./interfaces";

type ButtonOptions = {
  label: string;
};

const defaultButtonOptions: ButtonOptions = {
  label: "",
};

class Button implements GuiComponent {
  htmlElement: HTMLElement;
  observers: (() => void)[];

  constructor(options?: ButtonOptions) {
    const buttonWrapper = document.createElement("div");
    buttonWrapper.className = "button-wrapper";
    this.htmlElement = buttonWrapper;

    const button = document.createElement("button");
    button.classList.add("button");
    button.textContent = options?.label || defaultButtonOptions.label;
    buttonWrapper.appendChild(button);

    this.observers = [];
    const handleClick = () => {
      this.observers.forEach((observer) => observer());
    };
    button.addEventListener("click", handleClick);
  }

  addObserver(observer: () => void) {
    this.observers.push(observer);
  }

  removeObserver(observer: () => void) {
    this.observers.splice(this.observers.indexOf(observer), 1);
  }
}

export default Button;
