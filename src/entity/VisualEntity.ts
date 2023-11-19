import { VisualEntityProperty } from 'src/entity/VisualEntityProperty';
import { VisualEntityTopic } from "src/entity/VisualEntityTopic";
import { Entity } from "../engine/Entity";

export class VisualEntity extends Entity {
  get isModelReady(): boolean {
    return this.getProperty<boolean>(VisualEntityProperty.IsModelReady);
  }

  set isModelReady(value: boolean) {
    this.setProperty(VisualEntityProperty.IsModelReady, value, VisualEntityTopic.UpdateModelReady);
  }
}
