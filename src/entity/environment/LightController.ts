import { Controller } from '../commons/Controller';
import { DirectionalLight } from 'three';
import { VisualEntity } from '../commons/VisualEntity';

export class LightController implements Controller {
  entity: VisualEntity | undefined;

  private target: VisualEntity | undefined;

  constructor(
    private light: DirectionalLight,
  ) {}

  setTarget(targetEntity: VisualEntity) {
    this.target = targetEntity;
  }

  update() {
    if (!this.target) return;

    this.light.target.position.copy(this.target.getPosition());
  }
}
