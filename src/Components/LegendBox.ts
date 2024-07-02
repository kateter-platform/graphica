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
    const legendBoxWrapper = document.createElement("div");
    legendBoxWrapper.className = "legendBox-wrapper";

    //Sjekker for om det er noen elementer i legendBox
    this.elements.length === 0
      ? (legendBoxWrapper.style.display = "none")
      : (legendBoxWrapper.style.display = "block");

    this.htmlElement = legendBoxWrapper;

    //Collapse/expand knapp
    const button = document.createElement("button");
    button.className = "size-adjust-button";
    button.addEventListener("click", () => {
      legendBoxWrapper.classList.toggle("minimized");
      this.updateButton(legendBoxWrapper, button);
    });
    this.updateButton(legendBoxWrapper, button);

    legendBoxWrapper.appendChild(button);
    this.updateComponents();

    //Emitters
    Plot.emitter.on("plotUpdated", (plot) => {
      this.updateComponents();
    });

    Point.emitter.on("pointUpdated", (point) => {
      this.updateComponents();
    });

    this.elements.forEach((element) => {
      if (element instanceof State) {
        this.states[element.getStateName()] = element;
      } else if (typeof element === "string") {
        this.addStringAsObserver(element);
      }
    });
  }

  updateComponents() {
    Array.from(this.htmlElement.children).forEach((child) => {
      if (child.className !== "size-adjust-button") {
        this.htmlElement.removeChild(child);
      }
    });
    if (!this.elements) {
      return;
    }
    this.elements.length === 0
      ? (this.htmlElement.style.display = "none")
      : (this.htmlElement.style.display = "block");

    for (const element of this.elements) {
      const functionContainer = document.createElement("div");
      functionContainer.className = "function-container";

      const icon = document.createElement("span");

      functionContainer.appendChild(icon);

      let textToDisplay = "";

      if (typeof element === "string") {
        textToDisplay =
          element + ": " + this.replaceStateNamesWithValues(element);
        icon.className = "point-icon";
        icon.style.backgroundColor = "#faa307";
      } else if (element instanceof State) {
        textToDisplay = element.getStateName() + ": " + element.getState();
        icon.className = "point-icon";
        icon.style.backgroundColor = "#faa307";
      } else if (element instanceof Component) {
        if (element instanceof Plot) {
          icon.className = "plot-icon";
          icon.style.backgroundColor = "#" + element.getColor();
        } else if (element instanceof Point) {
          icon.className = "point-icon";
          icon.style.backgroundColor = "#" + element.getColorAsString();
        } else {
          icon.className = "triangle-icon";
          icon.style.borderBottomColor = "#" + element.getColorAsString();
        }

        textToDisplay = element.getDisplayText
          ? element.getName() + ": " + element.getDisplayText()
          : element.getName();
      }

      const renderedEquation = renderToString.renderToString(textToDisplay, {
        output: "mathml",
        strict: false,
        trust: true,
      });

      const htmlElementText = document.createElement("div");
      htmlElementText.innerHTML = renderedEquation;

      if (element instanceof Component) {
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

      functionContainer.appendChild(htmlElementText);
      this.htmlElement.appendChild(functionContainer);
    }
  }

  updateButton(legendBoxWrapper: HTMLDivElement, button: HTMLButtonElement) {
    if (!legendBoxWrapper.classList.contains("minimized")) {
      button.innerHTML = "&#8601;";
    } else {
      button.innerHTML = "&#8599;";
    }
  }

  addElement(element: Component | String | State<number>) {
    if (this.elements.includes(element)) {
      return;
    }
    this.elements.push(element);

    // Add observer if the element is a state
    if (element instanceof State) {
      if (this.states[element.getStateName()]) {
        return;
      }
      this.states[element.getStateName()] = element;
    }

    // If the element is a string, parse it to find state names
    if (typeof element === "string") {
      this.addStringAsObserver(element);
    }

    this.updateComponents();
  }

  // Parse a string to find state names and add the string as an observer to the corresponding states
  addStringAsObserver(str: string) {
    const stateNames = this.parseStateNames(str);
    stateNames.forEach((stateName) => {
      if (this.states[stateName]) {
        this.states[stateName].addObserver(() => this.updateComponents());
      }
    });
  }

  // Parse a string to find state names
  parseStateNames(str: string): string[] {
    return Array.from(new Set(str.match(/[a-z]/gi) || []));
  }

  // Replace state names in a string with their current values
  replaceStateNamesWithValues(str: string): string {
    let result = str;
    const stateNames = this.parseStateNames(str);
    stateNames.forEach((stateName) => {
      if (this.states[stateName]) {
        result = result.replace(
          new RegExp(stateName, "g"),
          this.states[stateName].getState().toString()
        );
      }
    });
    return result;
  }
}

export default LegendBox;
