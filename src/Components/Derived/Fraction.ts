import { Group, Vector2 } from "three";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { toVector2 } from "../../utils";
import Arc from "../Arc";
import { Component } from "../interfaces";
import { InputPosition } from "../types";

export type FractionOptions = {
  color?: number;
};

export const defaultShapeOptions: FractionOptions = {
  color: 0xfaa307,
};

class Fraction extends Component {
  radius: number;
  divisors: Group;
  filled: number;
  divisor: number;

  constructor(x = 0, y = 0, radius = 5, divisor = 2, filled = divisor) {
    super();
    if (filled > divisor) {
      throw new Error("Cannot have more filled parts than divisor!");
    }
    this.radius = radius;
    this.position.set(x, y, this.position.z);
    this.filled = filled;
    this.divisor = divisor;
    this.name = "Fraction";

    this.divisors = new Group();
    this.generateDivisors(radius, divisor, filled);
  }

  generateDivisors(radius: number, divisor: number, filled: number): void {
    const angleStep: number = (2 * Math.PI) / divisor;
    const lineMaterial = new LineMaterial({
      color: 0x000000,
      linewidth: 4,
      resolution: new Vector2(window.innerWidth, window.innerHeight),
    });
    for (let i = 0; i < divisor; i++) {
      const startAngle: number = i * angleStep;
      const endAngle: number = startAngle + angleStep;

      const startX: number = radius * Math.cos(startAngle);
      const startY: number = radius * Math.sin(startAngle);

      const endX: number = radius * Math.cos(endAngle);
      const endY: number = radius * Math.sin(endAngle);

      const color = i < filled ? 0xfaa307 : 0xffffff;
      console.log(
        `Filled is ${filled} and i is ${i} and i <= filled is ${
          i <= filled
        } so color is ${color}`
      );

      const lineGeometry = new LineGeometry();
      lineGeometry.setPositions([
        0,
        0,
        this.position.z + 0.1,
        0 + radius * Math.cos(startAngle),
        0 + radius * Math.sin(startAngle),
        this.position.z + 0.1,
      ]);
      const divisionLine = new Line2(lineGeometry, lineMaterial);

      this.divisors.add(divisionLine);
      const a = new Arc([endX, endY], [0, 0], [startX, startY], {
        radius: radius,
        hasLabel: false,
        resolution: 128,
        textOffset: [0, 0],
        color: color,
        dynamic: false,
      });
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

    this.generateDivisors(this.radius, this.divisor, this.filled);
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
    this.generateDivisors(this.radius, this.divisor, this.filled);
  }

  public getFilled(): number {
    return this.filled;
  }

  public getDivisor(): number {
    return this.divisor;
  }

  public setPosition(position: InputPosition) {
    this.position.set(
      toVector2(position).x,
      toVector2(position).y,
      this.position.z
    );
  }
}

export default Fraction;
