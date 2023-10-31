import { Vector3, Quaternion } from 'three';
import {VisualEntityTopic} from "./VisualEntityTopic";
import {Entity} from "./Entity";

export class VisualEntity extends Entity {
  private position = new Vector3();
  private rotation = new Quaternion();
  private velocity = new Vector3(0, 0, 0);
  private _isModelReady = false;

  // FIXME make getter and setter after refactoring
  getPosition(): Vector3 {
    return this.position;
  }

  setPosition(p: Vector3) {
    this.position.copy(p);
    this.broadcast({
      topic: 'update.position',
      value: this.position,
    });
  }

  getVelocity(): Vector3 {
    return this.velocity;
  }

  setVelocity(p: Vector3) {
    this.velocity.copy(p);
    this.broadcast({
      topic: 'update.velocity',
      value: this.velocity,
    });
  }

  // FIXME make getter and setter after refactoring
  getRotation(): Quaternion {
    return this.rotation;
  }

  setRotation(r: Quaternion) {
    this.rotation.copy(r);
    this.broadcast({
      topic: 'update.rotation',
      value: this.rotation,
    });
  }

  set isModelReady(value: boolean) {
    this._isModelReady = value;
    this.broadcast<boolean>({
      topic: VisualEntityTopic.ModelLoaded,
      value: this._isModelReady,
    });
  }

  get isModelReady(): boolean {
    return this._isModelReady;
  }
}
