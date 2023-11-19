import { Entity } from 'src/engine/Entity';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { PositionProperty } from 'src/entity/PositionController';
import { Vector3 } from 'three';
import { Controller } from '../engine/Controller';
import { GameEngine } from '../engine/GameEngine';
import { SurfaceFactor } from '../factor/surface/SurfaceFactor';
import { SpatialClient, SpatialPoint } from './SpatialTyping';

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

    this._client = this.surfaceFactor.grid.NewClient(entity, pos, [1, 1]);
    entity.on(PositionProperty, this.onPositionChange.bind(this));
  }

  get surfaceFactor(): SurfaceFactor {
    return this.engine.factors.find(SurfaceFactor);
  }

  onPositionChange(event: UpdatePropertyEvent<Vector3>) {
    if (!this._client) return;

    this._client.position = [event.next.x, event.next.z];
    this.surfaceFactor.grid.UpdateClient(this._client);
  }

  FindNearbyEntities(range: number): SpatialClient[] {
    const position = this.entity.getProperty<Vector3>(PositionProperty);

    const results = this.surfaceFactor.grid.FindNear(
      [position.x, position.z],
        [range, range]
    );

    return results.filter(c => c.entity != this.entity);
  }
}
