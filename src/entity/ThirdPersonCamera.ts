import {Component} from "./commons/Component";
import {Entity} from "./commons/Entity";
import {PerspectiveCamera, Vector3} from "three";

export class ThirdPersonCamera implements Component {
  entity: Entity | undefined;
  target: Entity | undefined;

  private currentPosition: Vector3;
  private currentLookAt: Vector3;

  constructor(
    private camera: PerspectiveCamera
  ) {

    this.currentPosition = new Vector3();
    this.currentLookAt = new Vector3();
  }

  calculateIdealOffset(target: Entity) {
    const idealOffset = new Vector3(-0, 10, -15);
    idealOffset.applyQuaternion(target.getRotation());
    idealOffset.add(target.getPosition());
    return idealOffset;
  }

  calculateIdealLookat(target: Entity) {
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

    this.currentPosition.lerp(idealOffset, t);
    this.currentLookAt.lerp(idealLookat, t);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }
}
