import { Group } from "three";
import Arc from "../Arc";
import { Component } from "../interfaces";

export type FractionOptions = {
  color?: number;
};

export const defaultShapeOptions: FractionOptions = {
  color: 0xfaa307,
};

class Fraction extends Component {
  radius: number;
  divisors: Group;
  x: number;
  y: number;
  filled: number;
  divisor: number;

  constructor(x = 0, y = 0, radius = 30, divisor = 2, filled = divisor) {
    super();
    if (filled > divisor) {
      throw new Error("Cannot have more filled parts than divisor!");
    }
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.filled = filled;
    this.divisor = divisor;

    this.divisors = new Group();
    this.generateDivisors(x, y, radius, divisor, filled);
  }

  generateDivisors(
    x: number,
    y: number,
    radius: number,
    divisor: number,
    filled: number
  ): void {
    const angleStep: number = 360 / divisor;
    for (let i = 1; i <= divisor; i++) {
      const startAngle: number = i * angleStep;
      const endAngle: number = (i + 1) * angleStep;

      const startAngleRad: number = (startAngle * Math.PI) / 180;
      const endAngleRad: number = (endAngle * Math.PI) / 180;

      const startX: number = x + radius * Math.cos(startAngleRad);
      const startY: number = y + radius * Math.sin(startAngleRad);

      const endX: number = x + radius * Math.cos(endAngleRad);
      const endY: number = y + radius * Math.sin(endAngleRad);
      const color = i <= filled ? 0xfaa307 : 0xfffffff;
      const a = new Arc(
        [startX, startY],
        [x, y],
        [endX, endY],
        radius,
        false,
        color
      );
      this.divisors.add(a);
    }
    this.add(this.divisors);
  }

  setDivisor(divisor: number): void {
    if (divisor < 1) {
      throw new Error("Divisor must be at least 1");
    }

    if (divisor === this.divisor) {
      return;
    }

    this.divisors.clear();

    this.divisor = divisor;

    this.generateDivisors(
      this.x,
      this.y,
      this.radius,
      this.divisor,
      this.filled
    );
  }

  setFilled(filled: number): void {
    if (filled < 0 || filled > this.divisor) {
      throw new Error("Filled value must be between 0 and the current divisor");
    }

    if (filled === this.filled) {
      return;
    }

    this.filled = filled;
    this.divisors.clear();

    this.generateDivisors(
      this.x,
      this.y,
      this.radius,
      this.divisor,
      this.filled
    );
  }
}

export default Fraction;
