import Core from "../../Core";
import Button from "../Button";
import { GuiComponent } from "../interfaces";

class OperationButtonPanel implements GuiComponent {
  htmlElement: HTMLElement;
  counter: number;
  operationList: (() => void)[];
  reverseOperationList: (() => void)[];
  backButton: Button;
  fourthButton: Button;

  constructor(operationList: (() => void)[], reverseOperationList: (() => void)[]) {
    const panelWrapper = document.createElement("div");
    panelWrapper.className = "panel-wrapper";
    this.htmlElement = panelWrapper;

    this.counter = 0;
    this.operationList = operationList;
    this.reverseOperationList = reverseOperationList;
    this.backButton = new Button({label: "<"});
    this.backButton.addObserver(() => this.executePreviousOperation());
    this.backButton.htmlElement
    this.fourthButton = new Button({label: ">"});
    this.fourthButton.addObserver(() => this.executeNextOperation());

    this.htmlElement.appendChild(this.backButton.htmlElement );
    this.htmlElement.appendChild(this.fourthButton.htmlElement);
    
    /* core.addGui(this.backButton);
    core.addGui(this.fourthButton); */
  }

  executeNextOperation(): void {
    if (this.counter < this.operationList.length) {
        const nextOperation = this.operationList[this.counter];
        nextOperation();
        this.counter++;
    } else {
        console.log("No more operations to perform");
    }
  }

  executePreviousOperation(): void {
    if (this.counter > 0) {
      this.counter--;
      const prevOperation = this.reverseOperationList[this.counter];
      prevOperation();
    } else {
        console.log("No earlier operations to perform");
    }
  }
}  

export default OperationButtonPanel;