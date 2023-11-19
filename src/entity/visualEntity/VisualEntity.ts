import { VisualEntityProperty } from 'src/entity/visualEntity/VisualEntityProperty';
import { VisualEntityTopic } from "src/entity/visualEntity/VisualEntityTopic";
import { Entity } from "src/engine/Entity";

export class VisualEntity extends Entity {
  get isModelReady(): boolean {
    return this.getProperty<boolean>(VisualEntityProperty.IsModelReady);
  }

  set isModelReady(value: boolean) {
    this.setProperty(VisualEntityProperty.IsModelReady, value, VisualEntityTopic.UpdateModelReady);
  }
}
