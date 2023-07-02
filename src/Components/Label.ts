    import { Vector2, Vector3, Object3D, Group, OrthographicCamera } from "three";
    import { InputPosition } from "./types";
    import { Component } from "./interfaces";
    import Line from "./Line";
    import Text from "./Text";
    import { toVector3 } from "../utils";

    const SCALING_FACTOR = 10;

    type LabelOptions = {
        text: string,
        start: InputPosition,
        deltaX?: number,
        deltaY?: number,
    };

    class Label implements Component {
        position: Vector3;
        object: Object3D;
        draggable: boolean = false;

        constructor({text, start = new Vector2(0,0), deltaX = 10, deltaY = 4}: LabelOptions) {
            
            // set position of the point instance
            this.position = toVector3(start);
            
            // calculate break and end points
            const breakPoint = this.calculateBreakPoint(deltaX, deltaY);
            const endPoint = this.calculateEndPoint(deltaX, deltaY);
            
            // Create line and text components
            const line1 = new Line(start, breakPoint);
            const line2 = new Line(breakPoint, endPoint);
            const textComponent = new Text(text, {color: "black", fontSize: 22, anchorY: "middle", anchorX: deltaX < 0 ? "right" : "left"});
            textComponent.object.position.set(endPoint.x + (deltaX < 0 ? -1 : 1) * 10, endPoint.y, 0.1);
            
            // Create a group to contain both lines and text
            this.object = new Group();
            this.object.add(line1.object);
            this.object.add(line2.object);
            this.object.add(textComponent.object);
            
            // set position of the group
            this.object.position.set(this.position.x, this.position.y, 0);
        }

        private calculateEndPoint(deltaX: number, deltaY: number) {
            return new Vector2(this.position.x + deltaX * SCALING_FACTOR, this.position.y + deltaY * SCALING_FACTOR);
        }
    
            
        private calculateBreakPoint(deltaX: number, deltaY: number) {
            let xValue = deltaX - Math.abs(deltaY);
            let yValue = 0;

            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                xValue = 0;
                yValue = deltaY - Math.abs(deltaX);

                if (deltaY < 0) {
                    yValue = deltaY + Math.abs(deltaX);
                }
            }

            if (deltaX < 0) {
                xValue = deltaX + Math.abs(deltaY);
            }

            return new Vector2(this.position.x + xValue * SCALING_FACTOR, this.position.y + yValue * SCALING_FACTOR
            );
        }

        update(camera: OrthographicCamera) {
            this.object.scale.set(1 / camera.zoom, 1 / camera.zoom, 1);
        }
    }
    export default Label;