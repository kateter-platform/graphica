import { Box3, Object3D, OrthographicCamera, Vector3 } from "three";
import Polygon, { PolygonOptions, PolygonVertices } from "../../Shape";
import { Collider } from "../../interfaces";

const defaultBoundingBoxOptions: PolygonOptions = {
  color: 0xffff00,
  opacity: 0,
  lineOpacity: 0,
  transparent: true,
  hasOutline: false,
};

class BoundingBox extends Polygon implements Collider {
  collider: Box3;
  polygon?: Polygon;
  constructor(vertices: PolygonVertices | Polygon) {
    if (vertices instanceof Polygon) {
      super(vertices.vertices, defaultBoundingBoxOptions);
      this.polygon = vertices;
      this.vertices = vertices.vertices;
    } else {
      super(vertices, defaultBoundingBoxOptions);
    }
    this.collider = new Box3().setFromObject(this.object);
    this.position.setZ(-1);
  }

  collidesWith(other: Collider): boolean {
    if (!this.collider.intersectsBox(other.collider)) {
      return false;
    }
    return true;
  }

  distanceTo(other: Collider): number {
    const centerA = new Vector3();
    this.collider.getCenter(centerA);

    const centerB = new Vector3();
    other.collider.getCenter(centerB);

    // Calculate the distance between the centers
    return centerA.distanceTo(centerB);
  }

  update(camera: OrthographicCamera): void {
    this.collider = new Box3().setFromObject(this.object);
    if (this.polygon) {
      this.position.setX(this.polygon.object.position.x);
      this.position.setY(this.polygon.object.position.y);
      this.position.setZ(-1);
    }
  }
}

export default BoundingBox;
