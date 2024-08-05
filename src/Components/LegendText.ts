type LegendTextOptions = {
  color?: string;
  shape?: string;
  useStates?: boolean;
};

const defaultLegendTextOptions = {
  color: "#faa307",
  shape: "circle",
  useStates: false,
};

class LegendText {
  private expression: string;
  private color: string;
  private shape: string;
  private useStates: boolean;

  constructor(expression: string, options?: LegendTextOptions) {
    const { color, shape, useStates } = {
      ...defaultLegendTextOptions,
      ...options,
    };
    this.expression = expression;
    this.color = color;
    this.shape = shape;
    this.useStates = useStates;
  }

  getExpression(): string {
    return this.expression;
  }

  getColor(): string {
    return this.color;
  }

  getShape(): string {
    return this.shape;
  }

  getUseStates(): boolean {
    return this.useStates;
  }

  getIcon(): string {
    switch (this.getShape()) {
      case "circle":
        return "circle-icon";
      case "rectangle":
        return "rectangle-icon";
      case "triangle":
        return "triangle-icon";
      default:
        return "circle-icon";
    }
  }
}
export default LegendText;
