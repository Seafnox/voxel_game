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
    // TODO refactor to separated component
    this.registerProperty(VisualEntityProperty.Position, new Vector3(0,0,0));
    // TODO refactor to separated component
    this.registerProperty(VisualEntityProperty.Rotation,new Quaternion(0,0,0,1));
    // TODO refactor to separated component
    this.registerProperty(VisualEntityProperty.Velocity,new Vector3(0,0,0));
  }

  // FIXME make getter and setter after refactoring or remove
  getPosition(): Vector3 {
    return this.getProperty<Vector3>(VisualEntityProperty.Position);
  }

  setPosition(value: Vector3) {
    this.setProperty(VisualEntityProperty.Position, value, VisualEntityTopic.UpdatePosition);
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
