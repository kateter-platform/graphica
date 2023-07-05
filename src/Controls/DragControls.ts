import {
  Camera,
  Event,
  EventDispatcher,
  Intersection,
  Matrix4,
  Object3D,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { Component } from "./../Components/Component";

const _plane = new Plane();
const _raycaster = new Raycaster();

const _pointer = new Vector2();
const _offset = new Vector3();
const _intersection = new Vector3();
const _worldPosition = new Vector3();
const _inverseMatrix = new Matrix4();

class DragControls extends EventDispatcher {
  enabled: boolean;
  transformGroup: boolean;

  activate?(): void;
  deactivate?(): void;
  dispose?(): void;
  getObjects?(): Object3D[];
  getRaycaster?(): Raycaster;

  constructor(_objects: Object3D[], _camera: Camera, _domElement: HTMLElement) {
    super();

    _domElement.style.touchAction = "none"; // disable touch scroll

    let _selected: Object3D | null = null,
      _hovered: Object3D | null = null;

    const _intersections: Intersection[] = [];

    const activate = () => {
      _domElement.addEventListener("pointermove", onPointerMove);
      _domElement.addEventListener("pointerdown", onPointerDown);
      _domElement.addEventListener("pointerup", onPointerCancel);
      _domElement.addEventListener("pointerleave", onPointerCancel);
    };

    const deactivate = () => {
      _domElement.removeEventListener("pointermove", onPointerMove);
      _domElement.removeEventListener("pointerdown", onPointerDown);
      _domElement.removeEventListener("pointerup", onPointerCancel);
      _domElement.removeEventListener("pointerleave", onPointerCancel);

      _domElement.style.cursor = "";
    };

    const dispose = () => {
      deactivate();
    };

    const getObjects = () => {
      return _objects;
    };

    const getRaycaster = () => {
      return _raycaster;
    };

    const onPointerMove = (event: Event) => {
      if (this.enabled === false) return;

      updatePointer(event);

      _raycaster.setFromCamera(_pointer, _camera);

      if (_selected) {
        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
          _selected.position.copy(
            _intersection.sub(_offset).applyMatrix4(_inverseMatrix)
          );
        }

        this.dispatchEvent({ type: "drag", object: _selected });

        return;
      }

      // hover support

      if (event.pointerType === "mouse" || event.pointerType === "pen") {
        _intersections.length = 0;

        _raycaster.setFromCamera(_pointer, _camera);
        _raycaster.intersectObjects(_objects, true, _intersections);

        if (_intersections.length > 0) {
          const object = _intersections[0].object;

          _plane.setFromNormalAndCoplanarPoint(
            _camera.getWorldDirection(_plane.normal),
            _worldPosition.setFromMatrixPosition(object.matrixWorld)
          );

          if (_hovered !== object && _hovered !== null) {
            this.dispatchEvent({ type: "hoveroff", object: _hovered });

            _domElement.style.cursor = "auto";
            _hovered = null;
          }

          if (_hovered !== object) {
            this.dispatchEvent({ type: "hoveron", object: object });

            _domElement.style.cursor = "pointer";
            _hovered = object;
          }
        } else {
          if (_hovered !== null) {
            this.dispatchEvent({ type: "hoveroff", object: _hovered });

            _domElement.style.cursor = "auto";
            _hovered = null;
          }
        }
      }
    };

    const onPointerDown = (event: Event) => {
      if (this.enabled === false) return;

      updatePointer(event);

      _intersections.length = 0;

      _raycaster.setFromCamera(_pointer, _camera);
      _raycaster.intersectObjects(_objects, true, _intersections);

      if (_intersections.length > 0) {
        _selected =
          this.transformGroup === true ? _objects[0] : _intersections[0].object;
        while (_selected.parent instanceof Component) {
          _selected = _selected.parent;
        }

        _plane.setFromNormalAndCoplanarPoint(
          _camera.getWorldDirection(_plane.normal),
          _worldPosition.setFromMatrixPosition(_selected.matrixWorld)
        );

        if (_raycaster.ray.intersectPlane(_plane, _intersection)) {
          _inverseMatrix
            .copy(
              _selected.parent ? _selected.parent.matrixWorld : new Matrix4()
            )
            .invert();
          _offset
            .copy(_intersection)
            .sub(_worldPosition.setFromMatrixPosition(_selected.matrixWorld));
        }

        _domElement.style.cursor = "move";

        this.dispatchEvent({ type: "dragstart", object: _selected });
      }
    };

    const onPointerCancel = () => {
      if (this.enabled === false) return;

      if (_selected) {
        this.dispatchEvent({ type: "dragend", object: _selected });

        _selected = null;
      }

      _domElement.style.cursor = _hovered ? "pointer" : "auto";
    };

    const updatePointer = (event: Event) => {
      const rect = _domElement.getBoundingClientRect();

      _pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = (-(event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    activate();

    // API

    this.enabled = true;
    this.transformGroup = false;

    this.activate = activate;
    this.deactivate = deactivate;
    this.dispose = dispose;
    this.getObjects = getObjects;
    this.getRaycaster = getRaycaster;
  }
}

export { DragControls };
