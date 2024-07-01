import Core from "../Core";
import renderToString from "katex";
import Plot from "./Plot";
import { Component, GuiComponent } from "./interfaces";
import "style.css";
import { OrthographicCamera } from "three";
import Point from "./Point";

class LegendBox implements GuiComponent {
  components: Component[];
  htmlElement: HTMLElement;

  constructor(components?: Component[]) {
    this.components = components || [];
    const legendBoxWrapper = document.createElement("div");
    legendBoxWrapper.className = "legendBox-wrapper";
    this.components.length === 0
      ? (legendBoxWrapper.style.display = "none")
      : (legendBoxWrapper.style.display = "block");
    this.htmlElement = legendBoxWrapper;
    const button = document.createElement("button");
    button.className = "size-adjust-button";
    button.addEventListener("click", () => {
      legendBoxWrapper.classList.toggle("minimized");
      this.updateButton(legendBoxWrapper, button);
    });
    this.updateButton(legendBoxWrapper, button);

    legendBoxWrapper.appendChild(button);
    this.updateComponents();

    Plot.emitter.on("plotUpdated", (plot) => {
      this.updateComponents();
    });

    Point.emitter.on("pointUpdated", (point) => {
      this.updateComponents();
    });
  }

  updateComponents() {
    Array.from(this.htmlElement.children).forEach((child) => {
      if (child.className !== "size-adjust-button") {
        this.htmlElement.removeChild(child);
      }
    });
    if (!this.components) {
      return;
    }
    this.components.length === 0
      ? (this.htmlElement.style.display = "none")
      : (this.htmlElement.style.display = "block");

    for (const component of this.components) {
      const functionContainer = document.createElement("div");
      functionContainer.className = "function-container";

      //FARGEPUNKT
      const colorDot = document.createElement("span");
      colorDot.className = "color-dot";
      colorDot.style.backgroundColor =
        "#" + (component.getColor ? component.getColor() : "000000");
      functionContainer.appendChild(colorDot);

      //NAVN OG DISPLAYTEXT I LATEX
      const textToDisplay = component.getDisplayText
        ? component.getName() + ": " + component.getDisplayText()
        : component.getName();
      const renderedEquation = renderToString.renderToString(textToDisplay, {
        output: "mathml",
        strict: false,
        trust: true,
      });

      const htmlElementText = document.createElement("div");
      htmlElementText.innerHTML = renderedEquation;

      //HOVER
      htmlElementText.addEventListener("mouseover", function () {
        if (component.hover) {
          htmlElementText.style.cursor = "pointer";
          component.hover();
        }
      });

      //UNHOVER
      htmlElementText.addEventListener("mouseout", function () {
        if (component.unhover) {
          component.unhover();
        }
      });

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

  addElement(component: Component) {
    if (this.components.includes(component)) {
      return;
    }
    this.components.push(component);
    this.updateComponents();
  }
}

export default LegendBox;
