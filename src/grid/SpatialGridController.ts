import { VisualEntity } from 'src/entity/VisualEntity';
import { Vector3 } from 'three';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { Controller } from '../engine/Controller';
import { GameEngine } from '../engine/GameEngine';
import { getVisualEntityOrThrow } from '../entity/utils/getVisualEntityOrThrow';
import { VisualEntityTopic } from '../entity/VisualEntityTopic';
import { SurfaceFactor } from '../factor/surface/SurfaceFactor';
import { SpatialClient, SpatialPoint } from './SpatialTyping';

export class SpatialGridController extends Controller<VisualEntity> {
  private _client?: SpatialClient;
  private positionSubscription?: Disposable;

  constructor(
    engine: GameEngine,
    entity: VisualEntity,
    name: string,
  ) {
    if (!(entity instanceof VisualEntity)) {
      throw new Error(`Can't make calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
    }

    super(engine, entity, name);

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

  get surfaceFactor(): SurfaceFactor {
    return this.engine.factors.findOne(SurfaceFactor);
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
