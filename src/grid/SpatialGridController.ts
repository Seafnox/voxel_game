import {Vector3} from 'three';
import {Component} from '../entity/commons/Component';
import {EmittedEvent} from '../entity/commons/EmittedEvent';
import {SpatialHashGrid, SpatialPoint, SpatialClient} from './SpatialHashGrid';
import {VisualEntity} from "../entity/commons/VisualEntity";

export class SpatialGridController implements Component {
  private _client?: SpatialClient;
  private boundedOnPositionChange = this._OnPosition.bind(this);

  constructor(
    private grid: SpatialHashGrid
  ) {
  }

  entity: VisualEntity | undefined;

  update(): void {}

  onEntityChange() {
    if (!this.entity) {
      console.log(this);
      throw new Error(`Can't find entity in ${this.constructor.name}`);
    }

    const entityPosition = this.entity.getPosition();
    const pos: SpatialPoint = [
      entityPosition.x,
      entityPosition.z,
    ];

    this._client = this.grid.NewClient(pos, [1, 1]);
    this._client.entity = this.entity;
    this.entity.on('update.position', this.boundedOnPositionChange);
  }

  _OnPosition(msg: EmittedEvent<Vector3>) {
    if (!this._client) return;

    this._client.position = [msg.value.x, msg.value.z];
    this.grid.UpdateClient(this._client);
  }

  FindNearbyEntities(range: number): SpatialClient[] {
    if (!this.entity) return [];

    const results = this.grid.FindNear(
      [this.entity.getPosition().x, this.entity.getPosition().z], [range, range]);

    return results.filter(c => c.entity != this.entity);
  }
}
