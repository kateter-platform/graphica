import Circle, { CircleOptions, defaultShapeOptions } from "../Circle";
import Line from "../Line";
import Text from "../Text"

export type NodeOptions =  CircleOptions & {
  label?: string;
};
  
const defaultNodeOptions: NodeOptions = {
  ...defaultShapeOptions,
  label: "",
};

type Edge = {
  node: Node;
  line: Line;
  weight?: number;
}

class Node extends Circle {  
  adjacencyList: Edge[];
  label?: Text;

  constructor(x = 0, y = 0, radius = 5, adjacencyList:Edge[] = [], options?: NodeOptions) {
    super(x, y, radius, options);
    const { label } = { ...defaultNodeOptions, ...options };
    if (label) {
      this.label = new Text(label, {position: [0,0], fontSize: this.calculateFontSize(label, radius), anchorX: "center", anchorY: "middle", responsiveScale: false});
      this.add(this.label)
    }
    this.adjacencyList = [...adjacencyList];
  }

  private calculateFontSize(text: string, radius: number): number {
    const maxDiameter = radius * 2;
    let fontSize = radius;

    while (fontSize > 0 && text.length * fontSize * 0.6 > maxDiameter) {
      fontSize -= 0.25;
    }
    
    return fontSize;
  }

  isAdjacentTo(node: Node): boolean {
    return this.adjacencyList.map((edge) => edge.node).includes(node);
  }

  connectTo(other: Node, directed: boolean, value?: number): void {
    if (!this.isAdjacentTo(other) && !(!directed && other.isAdjacentTo(this))) {
      const dx = other.position.x - this.position.x;
      const dy = other.position.y - this.position.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const cos = Math.abs(dx) / dist;
      const sin = Math.abs(dy) / dist;

      if (dx >= 0 && dy >= 0) {
        const outlineX1 = cos * this.radius;
        const outlineY1 = sin * this.radius;
        const outlineX2 = other.position.x - cos * other.radius;
        const outlineY2 = other.position.y - sin * other.radius;

        const line = new Line([outlineX1, outlineY1], [outlineX2-this.position.x, outlineY2-this.position.y], {arrowhead: directed, curve: directed ? 5 : 0, label: value !== undefined ? value.toString() : ""});
        this.adjacencyList.push({node: other, line: line, weight: value});
        this.add(line);
      }
      else if (dx >= 0 && dy < 0) {
        const outlineX1 = cos * this.radius;
        const outlineY1 = -sin * this.radius;
        const outlineX2 = other.position.x - cos * other.radius;
        const outlineY2 = other.position.y + sin * other.radius;

        const line = new Line([outlineX1, outlineY1], [outlineX2-this.position.x, outlineY2-this.position.y], {arrowhead: directed, curve: directed ? 5 : 0, label: value !== undefined ? value.toString() : ""});
        this.adjacencyList.push({node: other, line: line, weight: value});
        this.add(line);
      }
      else if (dx < 0 && dy < 0) {
        const outlineX1 = -cos * this.radius;
        const outlineY1 = -sin * this.radius;
        const outlineX2 = other.position.x + cos * other.radius;
        const outlineY2 = other.position.y + sin * other.radius;

        const line = new Line([outlineX1, outlineY1], [outlineX2-this.position.x, outlineY2-this.position.y], {arrowhead: directed, curve: directed ? 5 : 0, label: value !== undefined ? value.toString() : ""});
        this.adjacencyList.push({node: other, line: line, weight: value});
        this.add(line);
      }
      else {
        const outlineX1 = -cos * this.radius;
        const outlineY1 = sin * this.radius;
        const outlineX2 = other.position.x + cos * other.radius;
        const outlineY2 = other.position.y - sin * other.radius;

        const line = new Line([outlineX1, outlineY1], [outlineX2-this.position.x, outlineY2-this.position.y], {arrowhead: directed, curve: directed ? 5 : 0, label: value !== undefined ? value.toString() : ""});
        this.adjacencyList.push({node: other, line: line, weight: value});
        this.add(line);
      }

      if (!directed) {
        other.connectTo(this, false);
      }
    }
  }

  disconnectFrom(other: Node): void {
    const index = this.adjacencyList.map((edge) => edge.node).indexOf(other);
    if (index > -1) {
      const directed = this.adjacencyList[index].line.arrowhead;
      this.remove(this.adjacencyList[index].line);
      this.adjacencyList.splice(index, 1);
      if (!directed) {
        other.disconnectFrom(this);
      }
    }
  }

  getWeight(other: Node): (number | undefined) {
    const index = this.adjacencyList.map((edge) => edge.node).indexOf(other);
    if (index > -1) {
      return this.adjacencyList[index].weight;
    } else {
      return undefined;
    }
  }

  addWeight(other: Node, value: number): void {
    const index = this.adjacencyList.map((edge) => edge.node).indexOf(other);
    if (index > -1) {
      if (this.adjacencyList[index].weight !== undefined) {
        this.adjacencyList[index].weight! += value;
      } else {
        this.adjacencyList[index].weight = value;
      }
      this.adjacencyList[index].line.setLabel(this.adjacencyList[index].weight?.toString()!);
    }
  }

  setWeight(other: Node, value: number): void {
    const index = this.adjacencyList.map((edge) => edge.node).indexOf(other);
    if (index > -1) {
      this.adjacencyList[index].weight = value;
      this.adjacencyList[index].line.setLabel(value.toString());
    }
  }

  setLabel(label: string) {
    if (this.label !== undefined) {
      this.label.setText(label);
      this.label.setFontSize(this.calculateFontSize(label, this.radius));
    }
    else {
      this.label = new Text(label, {position: [0,0], fontSize: this.calculateFontSize(label, this.radius), anchorX: "center", anchorY: "middle", responsiveScale: false});
      this.add(this.label)
    }
  }

}

export default Node;