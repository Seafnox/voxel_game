import { GameEngine } from 'src/engine/GameEngine';
import { VisualEntityProperty } from 'src/entity/VisualEntityProperty';
import { Vector3, Quaternion } from 'three';
import {VisualEntityEvent} from "src/entity/VisualEntityEvent";
import {Entity} from "../engine/Entity";

export class VisualEntity extends Entity {
  constructor(
    gameEngine: GameEngine,
    name: string,
  ) {
    super(gameEngine, name);
    this.setPosition(new Vector3());
    this.setRotation(new Quaternion());
    this.setVelocity(new Vector3());
    this.isModelReady = false;
  }

  // FIXME make getter and setter after refactoring
  getPosition(): Vector3 {
    return this.getProperty<Vector3>(VisualEntityProperty.Position);
  }

  setPosition(value: Vector3) {
    this.setProperty(VisualEntityProperty.Position, value, VisualEntityEvent.UpdatePosition);
  }

  // FIXME make getter and setter after refactoring
  getVelocity(): Vector3 {
    return this.getProperty<Vector3>(VisualEntityProperty.Velocity);
  }

  setVelocity(value: Vector3) {
    this.setProperty(VisualEntityProperty.Velocity, value, VisualEntityEvent.UpdateVelocity);
  }

  // FIXME make getter and setter after refactoring
  getRotation(): Quaternion {
    return this.getProperty<Quaternion>(VisualEntityProperty.Rotation);
  }

  setRotation(value: Quaternion) {
    this.setProperty(VisualEntityProperty.Rotation, value, VisualEntityEvent.UpdateRotation);
  }

  get isModelReady(): boolean {
    return this.getProperty<boolean>(VisualEntityProperty.IsModelReady);
  }

  set isModelReady(value: boolean) {
    this.setProperty(VisualEntityProperty.IsModelReady, value, VisualEntityEvent.UpdateModelReady);
  }
}
