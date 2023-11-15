import { Vector3 } from 'three';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { Controller } from '../entity/commons/Controller';
import { Entity } from '../entity/commons/Entity';
import { GameEngine } from '../entity/commons/GameEngine';
import { getVisualEntityOrThrow } from '../entity/commons/utils/getVisualEntityOrThrow';
import { VisualEntityTopic } from '../entity/commons/VisualEntityTopic';
import { SurfaceFactor } from '../factor/surface/SurfaceFactor';
import { SpatialClient, SpatialPoint } from './SpatialTyping';

export class SpatialGridController extends Controller {
  private _client?: SpatialClient;
  private positionSubscription?: Disposable;
  private surfaceFactor: SurfaceFactor;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.surfaceFactor = this.engine.factors.findOne(SurfaceFactor);
  }

  onEntityChange() {
    const entity = getVisualEntityOrThrow(this, this.entity);
    const entityPosition = entity.getPosition();
    const pos: SpatialPoint = [
      entityPosition.x,
      entityPosition.z,
    ];

    this.positionSubscription?.dispose();
    this._client = this.surfaceFactor.grid.NewClient(entity, pos, [1, 1]);
    this._client.entity = entity;
    this.positionSubscription = entity.on(VisualEntityTopic.UpdatePosition, this.onPositionChange.bind(this));
  }

  onPositionChange(msg: Vector3) {
    if (!this._client) return;

    this._client.position = [msg.x, msg.z];
    this.surfaceFactor.grid.UpdateClient(this._client);
  }

  FindNearbyEntities(range: number): SpatialClient[] {
    const entity = getVisualEntityOrThrow(this, this.entity);

    const results = this.surfaceFactor.grid.FindNear(
      [entity.getPosition().x, entity.getPosition().z],
        [range, range]
    );

    return results.filter(c => c.entity != this.entity);
  }
}
