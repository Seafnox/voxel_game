import { Vector3 } from 'three';
import { Disposable } from 'src/emitter/SimpleEmitter';
import { Controller } from '../entity/commons/Controller';
import { Entity } from '../entity/commons/Entity';
import { getVisualEntityOrThrow } from '../entity/commons/utils/getVisualEntityOrThrow';
import { VisualEntityTopic } from '../entity/commons/VisualEntityTopic';
import { SurfaceController } from '../entity/environment/SurfaceController';
import { SpatialClient, SpatialPoint } from './SpatialTyping';

export class SpatialGridController implements Controller {
  private _client?: SpatialClient;
  private positionSubscription?: Disposable;

  constructor(
    private surfaceController: SurfaceController,
  ) {}

  entity: Entity | undefined;

  update(): void {
  }

  onEntityChange() {
    const entity = getVisualEntityOrThrow(this, this.entity);
    const entityPosition = entity.getPosition();
    const pos: SpatialPoint = [
      entityPosition.x,
      entityPosition.z,
    ];

    this.positionSubscription?.dispose();
    this._client = this.surfaceController.getGrid().NewClient(entity, pos, [1, 1]);
    this._client.entity = entity;
    this.positionSubscription = entity.on(VisualEntityTopic.UpdatePosition, this.onPositionChange.bind(this));
  }

  onPositionChange(msg: Vector3) {
    if (!this._client) return;

    this._client.position = [msg.x, msg.z];
    this.surfaceController.getGrid().UpdateClient(this._client);
  }

  FindNearbyEntities(range: number): SpatialClient[] {
    const entity = getVisualEntityOrThrow(this, this.entity);

    const results = this.surfaceController.getGrid().FindNear(
      [entity.getPosition().x, entity.getPosition().z],
        [range, range]
    );

    return results.filter(c => c.entity != this.entity);
  }
}
