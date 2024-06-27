import { largerEq } from "mathjs";
import Core from "../Core";
import renderToString from "katex";
import Plot from "./Plot";
import { GuiComponent } from "./interfaces";
import "style.css";

//usikker på om denne trengs
type LegendBoxOptions = {
  label: string;
};

const defaultLegendBoxOptions: LegendBoxOptions = {
  label: "",
};

class LegendBox implements GuiComponent {
  private core: Core;
  htmlElement: HTMLElement;
  //   observers: (() => void)[];

  constructor(core: Core, options?: LegendBoxOptions) {
    this.core = core;
    const legendBoxWrapper = document.createElement("div");
    legendBoxWrapper.className = "legendBox-wrapper";
    this.htmlElement = legendBoxWrapper;
    this.updatePlots();
  }

  updatePlots() {
    for (const component of this.core.getComponents()) {
      if (component instanceof Plot) {
        const functionContainer = document.createElement("div");
        functionContainer.className = "function-container";

        //Fargedott
        const colorDot = document.createElement("span");
        colorDot.className = "color-dot";
        colorDot.style.backgroundColor = "#" + component.getColor();
        functionContainer.appendChild(colorDot);

        //Funksjonnavn og funksjon som Latex
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
  }
}

export default LegendBox;
