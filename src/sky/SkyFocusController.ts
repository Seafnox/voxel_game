import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { SceneFactor } from 'src/render/SceneFactor';
import { SkyFactor } from 'src/sky/SkyFactor';
import { HemisphereLight, Mesh, Vector3 } from 'three';

export class SkyFocusController extends Controller {

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.sceneFactor.add(this.skySphere, this.skySphereLight);

    this.entity.on(PositionProperty.name, this.targetPositionChange.bind(this));

    this.targetPositionChange({
      prev: undefined,
      next: this.entity.properties.find(PositionProperty).get(),
    })

  }

  get skySphere(): Mesh {
    return this.engine.factors.find(SkyFactor).skySphere;
  }

  get skySphereLight(): HemisphereLight {
    return this.engine.factors.find(SkyFactor).skySphereLight;
  }

  get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }

  private targetPositionChange(event: UpdatePropertyEvent<Vector3>) {
    this.skySphere.position.x = event.next.x;
    this.skySphere.position.z = event.next.z;
  }
}
