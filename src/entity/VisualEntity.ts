import { GameEngine } from 'src/engine/GameEngine';
import { VisualEntityProperty } from 'src/entity/VisualEntityProperty';
import { Vector3, Quaternion } from 'three';
import {VisualEntityTopic} from "src/entity/VisualEntityTopic";
import {Entity} from "../engine/Entity";

export class VisualEntity extends Entity {
  constructor(
    gameEngine: GameEngine,
    name: string,
  ) {
    super(gameEngine, name);
    this.setPosition(new Vector3(0,0,0));
    this.setRotation(new Quaternion(0,0,0,1));
    this.setVelocity(new Vector3(0,0,0));
    this.isModelReady = false;
  }

  // FIXME make getter and setter after refactoring or remove
  getPosition(): Vector3 {
    return this.getProperty<Vector3>(VisualEntityProperty.Position);
  }

  setPosition(value: Vector3) {
    this.setProperty(VisualEntityProperty.Position, value, VisualEntityTopic.UpdatePosition);
  }

  // FIXME make getter and setter after refactoring or remove
  getVelocity(): Vector3 {
    return this.getProperty<Vector3>(VisualEntityProperty.Velocity);
  }

  setVelocity(value: Vector3) {
    this.setProperty(VisualEntityProperty.Velocity, value);
  }

  // FIXME make getter and setter after refactoring or remove
  getAcceleration(): Vector3 {
    return this.getProperty<Vector3>(VisualEntityProperty.Acceleration);
  }

  setAcceleration(value: Vector3) {
    this.setProperty(VisualEntityProperty.Acceleration, value);
  }

  // FIXME make getter and setter after refactoring or remove
  getRotation(): Quaternion {
    return this.getProperty<Quaternion>(VisualEntityProperty.Rotation);
  }

  setRotation(value: Quaternion) {
    this.setProperty(VisualEntityProperty.Rotation, value, VisualEntityTopic.UpdateRotation);
  }

  get isModelReady(): boolean {
    return this.getProperty<boolean>(VisualEntityProperty.IsModelReady);
  }

  set isModelReady(value: boolean) {
    this.setProperty(VisualEntityProperty.IsModelReady, value, VisualEntityTopic.UpdateModelReady);
  }
}
