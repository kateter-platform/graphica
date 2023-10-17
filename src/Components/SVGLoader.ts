import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  ShapeGeometry,
  Vector2,
  Box3,
  Vector3,
} from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { Line2, LineGeometry, LineMaterial } from "three-fatline";
import { Component } from "./interfaces";

class SVG extends Component {
  draggable = undefined;

  constructor(url: string, position = new Vector3(0, 0, 0)) {
    super();
    const loader = new SVGLoader();

    loader.load(
      url,
      (data) => {
        const paths = data.paths;
        const group = new Group();

        for (const path of paths) {
          const fillColor =
            path.userData?.style.fill !== undefined
              ? path.userData.style.fill
              : 0x000000;
          const strokeColor =
            path.userData?.style.stroke !== undefined
              ? path.userData?.style.stroke
              : 0x000000;

          const strokeWidth =
            path.userData?.style.strokeWidth !== undefined
              ? path.userData?.style.strokeWidth
              : 1;

          const shapes = SVGLoader.createShapes(path);

          for (const shape of shapes) {
            const geometry = new ShapeGeometry(shape);

            // Check if the shape has a fill property
            if (path.userData?.style.fill !== undefined) {
              const material = new MeshBasicMaterial({
                color: fillColor,
                side: DoubleSide,
              });
              const mesh = new Mesh(geometry, material);
              group.add(mesh);
            }

            // Check if the shape has a stroke property
            if (path.userData?.style.stroke !== undefined) {
              const strokeGeometry = new LineGeometry().setFromPoints(
                shape.getPoints()
              );
              const material = new LineMaterial({
                color: strokeColor,
                linewidth: 5,
                resolution: new Vector2(window.innerWidth, window.innerHeight),
              });
              const line = new Line2(strokeGeometry, material);
              group.add(line);
            }
          }
        }
        group.rotation.set(Math.PI, 0, 0);
        const boundingBox = new Box3().setFromObject(group);
        const size = new Vector3();
        boundingBox.getSize(size);
        group.position.set(position.x, position.y + size.y, position.z);
        this.add(group);
      },

      (error) => {
        console.log(
          "An error happened loading the provided SVG. Is the path correct?",
          error
        );
      }
    );
  }
}

export default SVG;
