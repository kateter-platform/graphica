import { Vector2, OrthographicCamera } from "three";
import { toVector2 } from "../utils";
import Line from "./Primitives/Line";
import { InputPosition } from "./Types/InputPosition";

export type VectorProps = {
    color?: number;
}

class Vector extends Line {
    vector: Vector2;

    constructor(position: InputPosition, vector: Vector2, {color = 0x000000}: VectorProps) {
        super(position, position, { lineWidth: 4, arrowhead: true });
        this.vector = vector;
    }

    calculateEndPoint(position: InputPosition, vector: Vector2) {
        position = toVector2(position);
        return new Vector2(position.x + vector.x, position.y + vector.y);
    }

    update(camera: OrthographicCamera) {
        this.end = this.calculateEndPoint(this.start, this.vector);
        this.updateGeometry(this.start, this.end, this.arrowhead, camera);
    }
}

export default Vector;