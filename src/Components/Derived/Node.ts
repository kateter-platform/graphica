import { Color, MeshBasicMaterial } from "three";
import { LineMaterial } from "three-fatline";
import Circle, { CircleOptions, defaultShapeOptions } from "../Circle";
import Line from "../Line";
import Text from "../Text";

export type NodeOptions = CircleOptions & {
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
};

class Node extends Circle {
  adjacencyList: Edge[];
  label?: Text;

  constructor(
    x = 0,
    y = 0,
    radius = 5,
    adjacencyList: Edge[] = [],
    options?: NodeOptions
  ) {
    super(x, y, radius, options);
    const { label } = { ...defaultNodeOptions, ...options };
    if (label) {
      this.label = new Text(label, {
        position: [0, 0],
        fontSize: this.calculateFontSize(label, radius),
        anchorX: "center",
        anchorY: "middle",
        responsiveScale: false,
      });
      this.add(this.label);
    }
    this.adjacencyList = [...adjacencyList];
  }

  /**
   * Help function to avoid node label from going outside of the node
   *
   * @param text - Node label
   * @param radius - Radius of the node
   * @returns FontSize which will keep the node label within the node
   */
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

  /**
   * Adds an edge from this node to the other node given and updates adjacencyList accordingly.
   * Calculations are made in order to have the edge go to/from the circle arc.
   *
   * @param other - Node to connect with edge
   * @param directed - Booleean for whether the edge is directed (directed edges will also have curve)
   * @param value - Number for eeight/value of the edge
   */
  connectTo(other: Node, directed = false, value?: number): void {
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

        const line = new Line(
          [outlineX1, outlineY1],
          [outlineX2 - this.position.x, outlineY2 - this.position.y],
          {
            arrowhead: directed,
            curve: directed ? 2 : 0,
            label: value !== undefined ? value.toString() : "",
          }
        );
        this.adjacencyList.push({ node: other, line: line, weight: value });
        this.add(line);
      } else if (dx >= 0 && dy < 0) {
        const outlineX1 = cos * this.radius;
        const outlineY1 = -sin * this.radius;
        const outlineX2 = other.position.x - cos * other.radius;
        const outlineY2 = other.position.y + sin * other.radius;

        const line = new Line(
          [outlineX1, outlineY1],
          [outlineX2 - this.position.x, outlineY2 - this.position.y],
          {
            arrowhead: directed,
            curve: directed ? 2 : 0,
            label: value !== undefined ? value.toString() : "",
          }
        );
        this.adjacencyList.push({ node: other, line: line, weight: value });
        this.add(line);
      } else if (dx < 0 && dy < 0) {
        const outlineX1 = -cos * this.radius;
        const outlineY1 = -sin * this.radius;
        const outlineX2 = other.position.x + cos * other.radius;
        const outlineY2 = other.position.y + sin * other.radius;

        const line = new Line(
          [outlineX1, outlineY1],
          [outlineX2 - this.position.x, outlineY2 - this.position.y],
          {
            arrowhead: directed,
            curve: directed ? 2 : 0,
            label: value !== undefined ? value.toString() : "",
          }
        );
        this.adjacencyList.push({ node: other, line: line, weight: value });
        this.add(line);
      } else {
        const outlineX1 = -cos * this.radius;
        const outlineY1 = sin * this.radius;
        const outlineX2 = other.position.x + cos * other.radius;
        const outlineY2 = other.position.y - sin * other.radius;

        const line = new Line(
          [outlineX1, outlineY1],
          [outlineX2 - this.position.x, outlineY2 - this.position.y],
          {
            arrowhead: directed,
            curve: directed ? 2 : 0,
            label: value !== undefined ? value.toString() : "",
          }
        );
        this.adjacencyList.push({ node: other, line: line, weight: value });
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

  getEdgeWeight(other: Node): number | undefined {
    const index = this.adjacencyList.map((edge) => edge.node).indexOf(other);
    if (index > -1) {
      return this.adjacencyList[index].weight;
    } else {
      return undefined;
    }
  }

  static addEdgeWeight(node: Node, other: Node, value: number): void {
    const index = node.adjacencyList.map((edge) => edge.node).indexOf(other);
    if (index > -1) {
      const edge = node.adjacencyList[index];
      if (edge.weight !== undefined) {
        edge.weight += value;
      } else {
        edge.weight = value;
      }
      edge.line.setLabel(edge.weight.toString());
    }
  }

  static setEdgeWeight(node: Node, other: Node, value: number): void {
    const index = node.adjacencyList.map((edge) => edge.node).indexOf(other);
    if (index > -1) {
      node.adjacencyList[index].weight = value;
      node.adjacencyList[index].line.setLabel(value.toString());
    }
  }

  setLabel(label: string): void {
    if (this.label !== undefined) {
      this.label.setText(label);
      this.label.setFontSize(this.calculateFontSize(label, this.radius));
    } else {
      this.label = new Text(label, {
        position: [0, 0],
        fontSize: this.calculateFontSize(label, this.radius),
        anchorX: "center",
        anchorY: "middle",
        responsiveScale: false,
      });
      this.add(this.label);
    }
  }

  static setColor(node: Node, color: number): void {
    node.material = new MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
    });
  }

  static setEdgeColor(node: Node, other: Node, color: number): void {
    const index = node.adjacencyList.map((edge) => edge.node).indexOf(other);
    if (index > -1) {
      (node.adjacencyList[index].line.material as LineMaterial).color =
        new Color(color);
    }
  }

  getEdge(other: Node): Edge | null {
    const index = this.adjacencyList.map((edge) => edge.node).indexOf(other);
    if (index > -1) {
      return this.adjacencyList[index];
    } else {
      return null;
    }
  }
}

export default Node;
