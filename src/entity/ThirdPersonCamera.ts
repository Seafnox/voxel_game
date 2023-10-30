import {Component} from "./commons/Component";
import {PerspectiveCamera, Vector3} from "three";
import {VisualEntity} from "./commons/VisualEntity";

export class ThirdPersonCamera implements Component {
  entity: VisualEntity | undefined;
  target: VisualEntity | undefined;

  private currentPosition: Vector3 = new Vector3();
  private currentLookAt: Vector3 = new Vector3();

  constructor(
    private camera: PerspectiveCamera
  ) {
    console.error(new Error('Camera update is broken!'));
  }

  calculateIdealOffset(target: VisualEntity) {
    const idealOffset = new Vector3(-0, 10, -15);
    idealOffset.applyQuaternion(target.getRotation());
    idealOffset.add(target.getPosition());
    return idealOffset;
  }

  calculateIdealLookat(target: VisualEntity) {
    const idealLookat = new Vector3(0, 5, 20);
    idealLookat.applyQuaternion(target.getRotation());
    idealLookat.add(target.getPosition());
    return idealLookat;
  }

  update(deltaTime: number) {
    if (!this.target) return;
    if (!this.entity) return;

    const idealOffset = this.calculateIdealOffset(this.target);
    const idealLookat = this.calculateIdealLookat(this.target);

    // const t = 0.05;
    // const t = 4.0 * deltaTime;
    const t = 1.0 - Math.pow(0.01, deltaTime);
    const currentPosition = this.currentPosition.clone();
    const currentLookAt = this.currentLookAt.clone();

    currentPosition.lerp(idealOffset, t);
    currentLookAt.lerp(idealLookat, t);

    // this.camera.position.copy(this.currentPosition);
    // this.camera.lookAt(this.currentLookAt);
  }
}
