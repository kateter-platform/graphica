import {
  MeshBasicMaterial,
  Mesh,
  CircleGeometry,
  RingGeometry,
  OrthographicCamera,
  Vector2,
  Group,
} from "three";
import Circle from "../Circle";
import Line from "../Line";
import { Component } from "../interfaces";

export type CircleOptions = {
  color?: number;
};

export const defaultShapeOptions: CircleOptions = {
  color: 0xfaa307,
};

class Fraction extends Component {
  radius: number;
  divisors: Group;

  constructor(x = 0, y = 0, radius = 30, divisor = 2, options?: CircleOptions) {
    super();
    this.radius = radius;
    this.divisors = new Group();
    this.generateDivisors(x, y, radius, divisor);
    const circle = new Circle(x, y, radius, options);
    this.add(circle);
  }

  generateDivisors(x: number, y: number, radius: number, divisor: number) {
    for (let i = 1; i <= divisor; i++) {
      const angle = (2 * Math.PI * i) / divisor;
      const x2 = x + radius * Math.cos(angle);
      const y2 = y + radius * Math.sin(angle);
      const a = new Line([x, y], [x2, y2], {
        color: 0x000000,
      });
      this.divisors.add(a);
    }
    this.add(this.divisors);
  }

  update(): void {}
}

export default Fraction;
