import Core from "../Core";
import renderToString from "katex";
import Plot from "./Plot";
import { Component, GuiComponent } from "./interfaces";
import "style.css";
import { OrthographicCamera } from "three";

class LegendBox implements GuiComponent {
  private core: Core;
  htmlElement: HTMLElement;

  constructor(core: Core) {
    this.core = core;
    const legendBoxWrapper = document.createElement("div");
    legendBoxWrapper.className = "legendBox-wrapper";
    this.htmlElement = legendBoxWrapper;
    const button = document.createElement("button");
    button.className = "size-adjust-button";
    button.addEventListener("click", () => {
      legendBoxWrapper.classList.toggle("minimized");
      this.updateButton(legendBoxWrapper, button);
    });
    this.updateButton(legendBoxWrapper, button);

    legendBoxWrapper.appendChild(button);
    this.updatePlots();

    Plot.emitter.on("expressionUpdated", (plot) => {
      this.updatePlots();
    });
  }

  updatePlots() {
    this.htmlElement.innerHTML = "";
    for (const component of this.core.getComponents()) {
      if (!(component instanceof Plot)) {
        continue;
      }
      if (component.hideFromLegend) {
        continue;
      }

      const functionContainer = document.createElement("div");
      functionContainer.className = "function-container";

      //FARGEDOTT
      const colorDot = document.createElement("span");
      colorDot.className = "color-dot";
      colorDot.style.backgroundColor = "#" + component.getColor();
      functionContainer.appendChild(colorDot);

      //FUNKSJONSNAVN OG FUNKSJON I LATEX
      const textToDisplay =
        component.funcName + ": " + component.getFunctionString();
      const renderedEquation = renderToString.renderToString(textToDisplay, {
        output: "mathml",
        strict: false,
        trust: true,
      });

      const htmlElementText = document.createElement("div");
      htmlElementText.innerHTML = renderedEquation;

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
}

export default LegendBox;
