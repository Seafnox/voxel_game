import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { SceneProperty } from 'src/render/SceneProperty';
import { Controller } from 'src/engine/Controller';
import { SunLightProperty } from 'src/sky/SunLightProperty';
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

    this.sceneProperty.add(this.light, this.light.target);

    this.entity.on(PositionProperty.name, this.targetPositionChange.bind(this));

    this.targetPositionChange({
      prev: undefined,
      next: this.entity.properties.find(PositionProperty).get(),
    })

  }

  get light(): DirectionalLight {
    return this.engine.properties.find(SunLightProperty).get();
  }

  get sceneProperty(): SceneProperty {
    return this.engine.properties.find(SceneProperty);
  }

  private targetPositionChange(event: UpdatePropertyEvent<Vector3>) {
    this.light.target.position.copy(event.next);

    this.light.position.x = event.next.x;
    this.light.position.z = event.next.z;
  }
}
