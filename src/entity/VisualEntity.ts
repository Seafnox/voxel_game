import { Vector3, Quaternion } from 'three';
import {VisualEntityTopic} from "./VisualEntityTopic";
import {Entity} from "../engine/Entity";

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
    this.broadcast(VisualEntityTopic.UpdatePosition, this.position);
  }

  getVelocity(): Vector3 {
    return this.velocity;
  }

  setVelocity(p: Vector3) {
    this.velocity.copy(p);
    this.broadcast(VisualEntityTopic.UpdateVelocity, this.velocity);
  }

  // FIXME make getter and setter after refactoring
  getRotation(): Quaternion {
    return this.rotation;
  }

  setRotation(r: Quaternion) {
    this.rotation.copy(r);
    this.broadcast(VisualEntityTopic.UpdateRotation, this.rotation);
  }

  set isModelReady(value: boolean) {
    this._isModelReady = value;
    this.broadcast<boolean>(VisualEntityTopic.ModelLoaded, this._isModelReady);
  }

  get isModelReady(): boolean {
    return this._isModelReady;
  }
}
