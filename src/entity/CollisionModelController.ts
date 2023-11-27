import { CollisionBox } from 'src/collision/CollisionBox';
import { CollisionFactor } from 'src/collision/CollisionFactor';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { PositionProperty } from 'src/entity/properties/visual';
import { Vector3 } from 'three';

export interface CollisionBoxConfig {
  size: Vector3;
  offset?: Vector3;
}

export class CollisionModelController extends Controller {
  private _boxes: CollisionBox[] = [];
  private _boxConfigs: Record<string, CollisionBoxConfig> = {};
  private idCounter = 0;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.on(PositionProperty, this.positionChanges.bind(this));
  }

  get entityName(): string {
    return this.entity.name;
  }

  get entityPosition(): Vector3 {
    return this.entity.getProperty<Vector3>(PositionProperty);
  }

  get collisionFactor(): CollisionFactor {
    return this.engine.factors.find(CollisionFactor);
  }

  get boxes(): CollisionBox[] {
    return this._boxes;
  }

  add(config: CollisionBoxConfig): this {
    const boxName = this.generateName(`${this.entityName}_Box`);
    const boxPosition = this.calculateBoxPosition(config.offset);

    const box = new CollisionBox(boxName, boxPosition, config.size);

    this.collisionFactor.register(box);
    this._boxes.push(box);
    this._boxConfigs[boxName] = config;

    return this;
  }

  private calculateBoxPosition(offset?: Vector3): Vector3 {
    const boxPosition = this.entityPosition;

    if (offset) {
      boxPosition.add(offset);
    }

    return boxPosition;
  }

  private positionChanges() {
    this._boxes.forEach(box => {
      const config = this._boxConfigs[box.name];
      box.position = this.calculateBoxPosition(config.offset);
    })
  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }
}
