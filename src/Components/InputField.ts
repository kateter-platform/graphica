import { GuiComponent } from "./interfaces";

class InputField implements GuiComponent {
  htmlElement: HTMLElement;
  observers: ((value: string) => void)[];

  constructor() {
    const inputFieldWrapper = document.createElement("div");
    inputFieldWrapper.className = "inputField-wrapper";
    this.htmlElement = inputFieldWrapper;

    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.classList.add("inputField");
    inputFieldWrapper.appendChild(inputField);

    this.observers = [];
    const handleInputChange = (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      this.observers.forEach((observer) => observer(value));
    };
    inputField.addEventListener("keyup", handleInputChange);
  }

  addObserver(observer: (value: string) => void) {
    this.observers.push(observer);
  }

  removeObserver(observer: () => void) {
    this.observers.splice(this.observers.indexOf(observer), 1);
  }
}

export default InputField;
