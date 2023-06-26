import * as THREE from "three";
import { Color, MOUSE, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

class TestClass {}

// Position and THREE.Color Data

const points = [
  0,
  0,
  0, // (x, y, z) position of the starting point (0, 0, 0)
  250,
  250,
  0, // (x, y, z) position of the ending point (250, 250, 0)
];

const colors = [250 / 255, 25 / 255, 25 / 255]; // Normalize color values between 0 and 1
// Line2 ( LineGeometry, LineMaterial )

const geometry = new LineGeometry();
geometry.setPositions(points);

const matLine = new LineMaterial({
  color: 0xff0000,
  linewidth: 0.005, // in world units with size attenuation, pixels otherwise
  vertexColors: true,

  //resolution:  // to be set by renderer, eventually
  dashed: false,
  alphaToCoverage: true,
});
const line = new Line2(geometry, matLine);
line.computeLineDistances();
line.scale.set(1, 1, 1);

scene.add(line);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enablePan = true;
controls.mouseButtons = {
  LEFT: MOUSE.PAN,
  MIDDLE: MOUSE.DOLLY,
  RIGHT: MOUSE.ROTATE,
};

scene.background = new Color(0xffffff); // Example: Magenta color

camera.position.z = 5;

function animateS() {
  requestAnimationFrame(animateS);
  renderer.render(scene, camera);
}

animateS();
