import Core from "../Core";
import renderToString from "katex";
import Plot from "./Plot";
import { Component, GuiComponent } from "./interfaces";
import "style.css";
import Point from "./Point";
import State from "./State";

class LegendBox implements GuiComponent {
  elements: (Component | String | State<number>)[];
  states: { [key: string]: State<number> };
  htmlElement: HTMLElement;

  constructor(elements?: (Component | String | State<number>)[]) {
    this.elements = elements || [];
    this.states = {};
    this.htmlElement = this.createLegendBoxWrapper();
    const button = this.createSizeAdjustButton();
    this.htmlElement.appendChild(button);
    this.registerEventListeners();
    this.initializeStatesAndStrings();
    this.updateComponents();
  }

  private createLegendBoxWrapper(): HTMLElement {
    const legendBoxWrapper = document.createElement("div");
    legendBoxWrapper.className = "legendBox-wrapper";
    legendBoxWrapper.style.display =
      this.elements.length === 0 ? "none" : "block";
    return legendBoxWrapper;
  }

  private createSizeAdjustButton(): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "size-adjust-button";
    button.addEventListener("click", () => {
      this.htmlElement.classList.toggle("minimized");
      this.updateButton(button);
    });
    this.updateButton(button);
    return button;
  }

  private updateButton(button: HTMLButtonElement): void {
    button.innerHTML = this.htmlElement.classList.contains("minimized")
      ? "&#8599;"
      : "&#8601;";
  }
  private registerEventListeners(): void {
    Plot.emitter.on("plotUpdated", () => this.updateComponents());
    Point.emitter.on("pointUpdated", () => this.updateComponents());
  }

  //States and strings given in the constructor are initialized (states are added to states-dictionary and strings are added as observers to the states they contain)
  private initializeStatesAndStrings(): void {
    this.elements.forEach((element) => {
      if (element instanceof State) {
        this.states[element.getStateName()] = element;
      } else if (typeof element === "string") {
        this.addStringAsObserver(element);
      }
    });
  }

  public updateComponents() {
    this.clearChildren();
    if (!this.elements) {
      return;
    }
    this.updateDisplay();
    this.elements.forEach((element) => this.processElement(element));
  }

  private clearChildren() {
    Array.from(this.htmlElement.children).forEach((child) => {
      if (child.className !== "size-adjust-button") {
        this.htmlElement.removeChild(child);
      }
    });
  }

  private updateDisplay() {
    this.htmlElement.style.display =
      this.elements.length === 0 ? "none" : "block";
  }

  private processElement(element: Component | String | State<number>) {
    const functionContainer = document.createElement("div");
    functionContainer.className = "function-container";
    const icon = this.createIcon(element);
    functionContainer.appendChild(icon);

    const textToDisplay = this.getTextToDisplay(element);
    const renderedEquation = renderToString.renderToString(textToDisplay, {
      output: "mathml",
      strict: false,
      trust: true,
    });
    const htmlElementText = this.createHtmlElementText(
      renderedEquation,
      element
    );

    functionContainer.appendChild(htmlElementText);
    this.htmlElement.appendChild(functionContainer);
  }

  private createIcon(element: Component | String | State<number>) {
    const icon = document.createElement("span");
    icon.className = this.getIconClass(element);
    if (icon.className === "triangle-icon") {
      icon.style.borderBottomColor = this.getIconColor(element);
    } else {
      icon.style.backgroundColor = this.getIconColor(element);
    }
    return icon;
  }

  private getTextToDisplay(element: Component | String | State<number>) {
    let textToDisplay = "";

    if (typeof element === "string") {
      textToDisplay =
        element + ": " + this.replaceStateNamesWithValues(element);
    } else if (element instanceof State) {
      textToDisplay =
        element.getStateName() + ": " + element.getState().toFixed(1);
    } else if (element instanceof Component) {
      textToDisplay = element.getDisplayText
        ? element.getName() + ": " + element.getDisplayText()
        : element.getName();
    }

    return textToDisplay;
  }

  private createHtmlElementText(
    renderedEquation: string,
    element: Component | String | State<number>
  ) {
    const htmlElementText = document.createElement("div");
    htmlElementText.innerHTML = renderedEquation;

    if (element instanceof Component) {
      this.addHoverListeners(htmlElementText, element);
    }

    return htmlElementText;
  }

  private addHoverListeners(
    htmlElementText: HTMLDivElement,
    element: Component
  ) {
    htmlElementText.addEventListener("mouseover", function () {
      if (element.hover) {
        htmlElementText.style.cursor = "pointer";
        element.hover();
      }
    });

    htmlElementText.addEventListener("mouseout", function () {
      if (element.unhover) {
        element.unhover();
      }
    });
  }

  private getIconClass(element: Component | String | State<number>) {
    if (typeof element === "string" || element instanceof State) {
      return "point-icon";
    } else if (element instanceof Plot) {
      return "plot-icon";
    } else if (element instanceof Point) {
      return "point-icon";
    } else {
      return "triangle-icon";
    }
  }

  private getIconColor(element: Component | String | State<number>) {
    if (element instanceof Component) {
      if (element instanceof Plot) {
        return "#" + element.getColor();
      }
      return "#" + element.getColorAsString();
    } else {
      return "#faa307";
    }
  }

  public addElement(element: Component | String | State<number>) {
    if (this.elements.includes(element)) {
      return;
    }
    this.elements.push(element);

    // Add to states if the element is a state
    if (element instanceof State) {
      if (this.states[element.getStateName()]) {
        return;
      }
      this.states[element.getStateName()] = element;
    }

    // If the element is a string, add it as an observer to the state variables it contains
    if (typeof element === "string") {
      this.addStringAsObserver(element);
    }

    this.updateComponents();
  }

  // Adds string as an observer to the state variables it contains
  private addStringAsObserver(str: string) {
    const stateNames = this.parseStateNames(str);
    stateNames.forEach((stateName) => {
      if (this.states[stateName]) {
        this.states[stateName].addObserver(() => this.updateComponents());
      }
    });
  }

  // Returns an array with the state variables present in the string
  private parseStateNames(str: string): string[] {
    return Array.from(new Set(str.match(/[a-z]/gi) || []));
  }

  // Replaces the state variables in str with their current value
  private replaceStateNamesWithValues(str: string): string {
    let result = str;
    const stateNames = this.parseStateNames(str);
    stateNames.forEach((stateName) => {
      if (this.states[stateName]) {
        result = result.replace(
          new RegExp(stateName, "g"),
          this.states[stateName].getState().toFixed(1).toString()
        );
      }
    });
    return result;
  }
}

export default LegendBox;
