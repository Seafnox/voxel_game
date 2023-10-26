import {Component} from "../commons/Component";
import {Object3D} from "three";
import {Entity} from "../commons/Entity";

export abstract class ModelController implements Component {
  protected model: Object3D | undefined;
  entity: Entity | undefined;

  getModel(): Object3D | undefined {
    return this.model;
  }

  abstract update(timeElapsed: number): void
}
