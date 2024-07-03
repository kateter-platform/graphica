import Button from "../Button";
import { GuiComponent } from "../interfaces";
import Node from "./Node";

class OperationButtonPanel implements GuiComponent {
  htmlElement: HTMLElement;
  counter: number;
  operationList: {
    type: "setColor" | "setEdgeColor" | "setEdgeWeight" | "addEdgeWeight";
    args: any[];
  }[];
  reverseOperationList: (() => void)[];
  backButton: Button;
  fourthButton: Button;

  constructor(
    operationList: {
      type: "setColor" | "setEdgeColor" | "setEdgeWeight" | "addEdgeWeight";
      args: any[];
    }[]
  ) {
    const panelWrapper = document.createElement("div");
    panelWrapper.className = "panel-wrapper";
    this.htmlElement = panelWrapper;

    this.counter = 0;
    this.operationList = operationList;
    this.reverseOperationList = [];
    this.backButton = new Button({ label: "<" });
    this.backButton.addObserver(() => this.reversePreviousOperation());
    this.backButton.htmlElement;
    this.fourthButton = new Button({ label: ">" });
    this.fourthButton.addObserver(() => this.executeNextOperation());

    this.htmlElement.appendChild(this.backButton.htmlElement);
    this.htmlElement.appendChild(this.fourthButton.htmlElement);
  }

  /**
   * Executes the next operation when ">"-button is clicked.
   * Also automatically computes the inverse and adds it to reverseOperationlist.
   */
  executeNextOperation(): void {
    if (this.counter < this.operationList.length) {
      const nextOperation = this.operationList[this.counter];
      if (nextOperation.type === "setColor") {
        if (this.counter >= this.reverseOperationList.length) {
          const color = nextOperation.args[0].material.color.getHex();
          this.reverseOperationList.push(() => {
            Node.setColor(nextOperation.args[0], color);
          });
        }
        Node.setColor(nextOperation.args[0], nextOperation.args[1]);
        this.counter++;
      } else if (nextOperation.type === "setEdgeColor") {
        if (this.counter >= this.reverseOperationList.length) {
          const color = nextOperation.args[0]
            .getEdge(nextOperation.args[1])
            .line.material.color.getHex();
          this.reverseOperationList.push(() => {
            Node.setEdgeColor(
              nextOperation.args[0],
              nextOperation.args[1],
              color
            );
          });
        }
        Node.setEdgeColor(
          nextOperation.args[0],
          nextOperation.args[1],
          nextOperation.args[2]
        );
        this.counter++;
      } else if (nextOperation.type === "setEdgeWeight") {
        if (this.counter >= this.reverseOperationList.length) {
          const prevEdgeWeight = nextOperation.args[0].getEdgeWeight(
            nextOperation.args[1]
          );
          this.reverseOperationList.push(() => {
            Node.setEdgeWeight(
              nextOperation.args[0],
              nextOperation.args[1],
              prevEdgeWeight
            );
          });
        }
        Node.setEdgeWeight(
          nextOperation.args[0],
          nextOperation.args[1],
          nextOperation.args[2]
        );
        this.counter++;
      } else if (nextOperation.type === "addEdgeWeight") {
        if (this.counter >= this.reverseOperationList.length) {
          this.reverseOperationList.push(() => {
            Node.addEdgeWeight(
              nextOperation.args[0],
              nextOperation.args[1],
              -nextOperation.args[2]
            );
          });
        }
        Node.addEdgeWeight(
          nextOperation.args[0],
          nextOperation.args[1],
          nextOperation.args[2]
        );
        this.counter++;
      }
    } else {
      console.log("No more operations to perform");
    }
  }

  /**
   * Reverses the previous operation when "<"-button is clicked.
   */
  reversePreviousOperation(): void {
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
