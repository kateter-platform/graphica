import { Box3, Object3D, OrthographicCamera, Vector3 } from "three";
import Polygon, { PolygonOptions, PolygonVertices } from "../../Shape";
import { Collider } from "../../interfaces";

const defaultBoundingBoxOptions: PolygonOptions = {
  color: 0xffff00,
  opacity: 1,
  lineOpacity: 1,
  transparent: true,
  hasOutline: false,
};

class BoundingBox extends Polygon implements Collider {
  polygon?: Polygon;
  constructor(vertices: PolygonVertices | Polygon) {
    if (vertices instanceof Polygon) {
      super(vertices.vertices, defaultBoundingBoxOptions);
      this.polygon = vertices;
      this.vertices = vertices.vertices;
    } else {
      super(vertices, defaultBoundingBoxOptions);
    }

    this.position.setZ(-1);
  }

  collidesWith(other: Collider): boolean {
    const collider1 = new Box3().setFromObject(this);
    const collider2 = new Box3().setFromObject(other);

    if (!collider1.intersectsBox(collider2)) {
      return false;
    }
    return true;
  }

  distanceTo(other: Collider): number {
    const collider1 = new Box3().setFromObject(this);
    const collider2 = new Box3().setFromObject(other);

    const centerA = new Vector3();
    collider1.getCenter(centerA);

    const centerB = new Vector3();
    collider2.getCenter(centerB);
    // Calculate the distance between the centers
    return centerA.distanceTo(centerB);
  }

  update(camera: OrthographicCamera): void {
    if (this.polygon) {
      this.position.setX(this.polygon.position.x * 2);
      this.position.setY(this.polygon.position.y * 2);
      this.position.setZ(-1);
    }
  }
}

export default BoundingBox;
