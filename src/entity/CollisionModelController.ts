import { CollisionBox } from 'src/collision/CollisionBox';
import { CollisionFactor } from 'src/collision/CollisionFactor';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { PositionProperty } from 'src/entity/properties/visual';
import { SceneFactor } from 'src/factor/SceneFactor';
import { Vector3, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

export interface CollisionUnitConfig {
  size: Vector3;
  offset?: Vector3;
}

export class CollisionModelController extends Controller {
  private _units: CollisionBox[] = [];
  private _unitConfigs: Record<string, CollisionUnitConfig> = {};
  private idCounter = 0;
  private _meshes: Record<string, Mesh> = {};

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.on(PositionProperty, this.positionChanges.bind(this));
  }

  get units(): CollisionBox[] {
    return this._units;
  }

  private get entityPosition(): Vector3 {
    return this.entity.getProperty<Vector3>(PositionProperty).clone();
  }

  private get collisionFactor(): CollisionFactor {
    return this.engine.factors.find(CollisionFactor);
  }

  private get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }

  add(config: CollisionUnitConfig): this {
    const unitName = this.generateName(`${this.entityName}_Box`);
    const unitPosition = this.calculateUnitPosition(config);

    const unit = new CollisionBox(unitName, unitPosition, config.size);
    const boxGeometry = new BoxGeometry(config.size.x, config.size.y, config.size.z);
    const unitMaterial = new MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
    })
    const unitMesh = new Mesh(boxGeometry, unitMaterial);
    unitMesh.position.copy(unit.position);

    this.collisionFactor.register(unit);
    this.sceneFactor.add(unitMesh);
    this._units.push(unit);
    this._meshes[unitName] = unitMesh;
    this._unitConfigs[unitName] = config;

    return this;
  }

  private calculateUnitPosition(config: CollisionUnitConfig): Vector3 {
    const entityPosition = this.entityPosition;

    if (config.offset) {
      entityPosition.add(config.offset);
    }

    entityPosition.y += config.size.y/2;

    return entityPosition;
  }

  private positionChanges() {
    this._units.forEach(unit => {
      const config = this._unitConfigs[unit.name];
      const unitMesh = this._meshes[unit.name];
      unit.position = this.calculateUnitPosition(config);
      unitMesh.position.copy(unit.position);
    })
  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }
}
