import { Controller } from '../commons/Controller';
import { DirectionalLight } from 'three';
import { Entity } from '../commons/Entity';
import { GameEngine } from '../commons/GameEngine';
import { VisualEntity } from '../commons/VisualEntity';

export class LightController extends Controller {
  private target: VisualEntity | undefined;

  constructor(
    private light: DirectionalLight,
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);
  }

  setTarget(targetEntity: VisualEntity) {
    this.target = targetEntity;
  }

  update() {
    if (!this.target) return;

    this.light.target.position.copy(this.target.getPosition());
  }
}
