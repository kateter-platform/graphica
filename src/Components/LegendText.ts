type LegendTextOptions = {
  shape?: "circle" | "rectangle" | "triangle";
  color?: string;
  useStates?: boolean;
};

const defaultLegendTextOptions = {

  shape: "circle",
  color: "#faa307",
  useStates: false,
};

class LegendText {
  private expression: string;

  private shape: string;
  private color: string;
  private useStates: boolean;

  constructor(expression: string, options?: LegendTextOptions) {
    const { shape, color, useStates } = {
      ...defaultLegendTextOptions,
      ...options,
    };
    this.expression = expression;
    this.shape = shape;
    this.color = color;
    this.useStates = useStates;
  }

  getExpression(): string {
    return this.expression;
  }

  getShape(): string {
    return this.shape;
  }

  getColor(): string {
    return this.color;
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
