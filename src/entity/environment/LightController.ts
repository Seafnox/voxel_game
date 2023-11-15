import { Controller } from '../../engine/Controller';
import { DirectionalLight } from 'three';
import { Entity } from '../../engine/Entity';
import { GameEngine } from '../../engine/GameEngine';
import { VisualEntity } from '../VisualEntity';

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
