import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { SceneFactor } from 'src/render/SceneFactor';
import { Controller } from 'src/engine/Controller';
import { SunLightFactor } from 'src/sky/SunLightFactor';
import { DirectionalLight, Vector3 } from 'three';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';

export class LightFocusController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.sceneFactor.add(this.light, this.light.target);

    this.entity.on(PositionProperty.name, this.targetPositionChange.bind(this));

    this.targetPositionChange({
      prev: undefined,
      next: this.entity.findProperty(PositionProperty).get(),
    })

  }

  get light(): DirectionalLight {
    return this.engine.factors.find(SunLightFactor).light;
  }

  get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }

  private targetPositionChange(event: UpdatePropertyEvent<Vector3>) {
    this.light.target.position.copy(event.next);

    this.light.position.x = event.next.x;
    this.light.position.z = event.next.z;
  }
}
