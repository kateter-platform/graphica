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
}

class Node extends Circle {  
  adjacencyList: Edge[];

  constructor(x = 0, y = 0, radius = 5, adjacencyList:Edge[] = [], options?: NodeOptions) {
    super(x, y, radius, options);
    const { label } = { ...defaultNodeOptions, ...options };
    this.add(new Text(label, {position: [0,0], fontSize: radius/2, anchorX: "center", anchorY: "middle", responsiveScale: false}))
    this.adjacencyList = [...adjacencyList];
  }

  isAdjacentTo(node: Node): boolean {
    return this.adjacencyList.map((edge) => edge.node).includes(node);
  }

  connectTo(other: Node) {
    if (!this.isAdjacentTo(other)) {
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

        const line = new Line([outlineX1, outlineY1], [outlineX2-this.position.x, outlineY2-this.position.y], {arrowhead: !other.isAdjacentTo(this)});
        this.adjacencyList.push({node: other, line: line});
        this.add(line);
      }
      else if (dx >= 0 && dy < 0) {
        const outlineX1 = cos * this.radius;
        const outlineY1 = -sin * this.radius;
        const outlineX2 = other.position.x - cos * other.radius;
        const outlineY2 = other.position.y + sin * other.radius;

        const line = new Line([outlineX1, outlineY1], [outlineX2-this.position.x, outlineY2-this.position.y], {arrowhead: !other.isAdjacentTo(this)});
        this.adjacencyList.push({node: other, line: line});
        this.add(line);
      }
      else if (dx < 0 && dy < 0) {
        const outlineX1 = -cos * this.radius;
        const outlineY1 = -sin * this.radius;
        const outlineX2 = other.position.x + cos * other.radius;
        const outlineY2 = other.position.y + sin * other.radius;

        const line = new Line([outlineX1, outlineY1], [outlineX2-this.position.x, outlineY2-this.position.y], {arrowhead: !other.isAdjacentTo(this)});
        this.adjacencyList.push({node: other, line: line});
        this.add(line);
      }
      else {
        const outlineX1 = -cos * this.radius;
        const outlineY1 = sin * this.radius;
        const outlineX2 = other.position.x + cos * other.radius;
        const outlineY2 = other.position.y - sin * other.radius;

        const line = new Line([outlineX1, outlineY1], [outlineX2-this.position.x, outlineY2-this.position.y], {arrowhead: !other.isAdjacentTo(this)});
        this.adjacencyList.push({node: other, line: line});
        this.add(line);
      }
      
      if (other.isAdjacentTo(this)) {
        other.connectTo(this);
      }
    }
    else if (this.isAdjacentTo(other) && other.isAdjacentTo(this)) {
      this.adjacencyList.filter((edge) => edge.node=other).map((edge) => edge.line.arrowhead = false)
    }
  }

  disconnectFrom(node: Node) {
    const index = this.adjacencyList.map((edge) => edge.node).indexOf(node);
    if (index > -1) {
      this.remove(this.adjacencyList[index].line);
      this.adjacencyList.splice(index, 1);
    }
  }

}

export default Node;