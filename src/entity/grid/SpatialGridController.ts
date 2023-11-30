import { Entity } from 'src/engine/Entity';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { PositionProperty } from 'src/entity/properties/visual';
import { SpatialFactor } from 'src/factor/SpatialFactor';
import { Vector3 } from 'three';
import { Controller } from 'src/engine/Controller';
import { GameEngine } from 'src/engine/GameEngine';
import { SpatialClient, SpatialPoint } from 'src/entity/grid/SpatialTyping';

export class SpatialGridController extends Controller {
  private _client: SpatialClient;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    const entityPosition = entity.getProperty<Vector3>(PositionProperty);
    const pos: SpatialPoint = [
      entityPosition.x,
      entityPosition.z,
    ];

    this._client = this.spatialFactor.grid.NewClient(entity, pos, [1, 1]);
    entity.on(PositionProperty, this.onPositionChange.bind(this));
  }

  get spatialFactor(): SpatialFactor {
    return this.engine.factors.find(SpatialFactor);
  }

  onPositionChange(event: UpdatePropertyEvent<Vector3>) {
    if (!this._client) return;

    this._client.position = [event.next.x, event.next.z];
    this.spatialFactor.grid.UpdateClient(this._client);
  }

  FindNearbyEntities(range: number): SpatialClient[] {
    const position = this.entity.getProperty<Vector3>(PositionProperty);

    const results = this.spatialFactor.grid.FindNear(
      [position.x, position.z],
        [range, range]
    );

    return results.filter(c => c.entity != this.entity);
  }
}
