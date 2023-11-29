import { CollisionBox } from 'src/collision/CollisionBox';
import { CollisionFactor } from 'src/collision/CollisionFactor';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { PositionProperty } from 'src/entity/properties/visual';
import { SceneFactor } from 'src/factor/SceneFactor';
import { Vector3, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

export interface CollisionBoxConfig {
  size: Vector3;
  offset?: Vector3;
}

export class CollisionModelController extends Controller {
  private _boxes: CollisionBox[] = [];
  private _boxConfigs: Record<string, CollisionBoxConfig> = {};
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

  get boxes(): CollisionBox[] {
    return this._boxes;
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

  add(config: CollisionBoxConfig): this {
    const boxName = this.generateName(`${this.entityName}_Box`);
    const boxPosition = this.calculateBoxPosition(config);

    const box = new CollisionBox(boxName, boxPosition, config.size);
    const boxGeometry = new BoxGeometry(config.size.x, config.size.y, config.size.z);
    const boxMaterial = new MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
    })
    const meshBox = new Mesh(boxGeometry, boxMaterial);
    meshBox.position.copy(box.position);

    this.collisionFactor.register(box);
    this.sceneFactor.add(meshBox);
    this._boxes.push(box);
    this._meshes[boxName] = meshBox;
    this._boxConfigs[boxName] = config;

    return this;
  }

  private calculateBoxPosition(config: CollisionBoxConfig): Vector3 {
    const boxPosition = this.entityPosition;

    if (config.offset) {
      boxPosition.add(config.offset);
    }

    boxPosition.y += config.size.y/2;

    return boxPosition;
  }

  private positionChanges() {
    this._boxes.forEach(box => {
      const config = this._boxConfigs[box.name];
      const meshBox = this._meshes[box.name];
      box.position = this.calculateBoxPosition(config);
      meshBox.position.copy(box.position);
    })
  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }
}
