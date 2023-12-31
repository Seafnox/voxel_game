import { CollisionBox } from 'src/collision/CollisionBox';
import { CollisionSystem } from 'src/collision/CollisionSystem';
import { CollisionUnitConfig } from 'src/collision/CollisionUnitConfig';
import { CollisionUnitsProperty } from 'src/collision/CollisionUnitsProperty';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { RotationProperty } from 'src/positioning/RotationProperty';
import { SceneProperty } from 'src/render/SceneProperty';
import { Vector3, Mesh, BoxGeometry, MeshBasicMaterial, Color } from 'three';

export class CollisionModelController extends Controller {
  private _unitConfigs: Record<string, CollisionUnitConfig> = {};
  private idCounter = 0;
  private _meshes: Record<string, Mesh<BoxGeometry, MeshBasicMaterial>> = {};
  private collidedColor = new Color(0x990000);
  private uncollidedColor = new Color(0x000000);
  // TODO Make global config
  private showMesh = false;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.properties.register(CollisionUnitsProperty, [] as CollisionBox[]);
    this.entity.on(PositionProperty.name, this.positionChanges.bind(this));
    this.entity.on(RotationProperty.name, this.rotationChanges.bind(this));
  }

  get units(): CollisionBox[] {
    return this.entity.properties.find(CollisionUnitsProperty).get();
  }

  private get entityPosition(): Vector3 {
    return this.entity.properties.find(PositionProperty).get().clone();
  }

  private get collisionSystem(): CollisionSystem {
    return this.engine.systems.find(CollisionSystem);
  }

  private get sceneProperty(): SceneProperty {
    return this.engine.properties.find(SceneProperty);
  }

  add(config: CollisionUnitConfig): this {
    const unitName = this.generateName(`${this.entityName}_Box`);
    const unitPosition = this.calculateUnitPosition(config);

    const unit = new CollisionBox(unitName, unitPosition, config.size);
    const boxGeometry = new BoxGeometry(config.size.x, config.size.y, config.size.z);
    const unitMaterial = new MeshBasicMaterial({
      color: this.uncollidedColor,
      wireframe: true,
    })
    const unitMesh = new Mesh(boxGeometry, unitMaterial);
    unitMesh.position.copy(unit.position);

    this.collisionSystem.register(unit);
    this.units.push(unit);
    this._unitConfigs[unitName] = config;

    this._meshes[unitName] = unitMesh;

    // TODO Make adoptive when convert to global config
    if (this.showMesh) {
      this.sceneProperty.add(unitMesh);
    }

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
    this.units.forEach(unit => {
      const config = this._unitConfigs[unit.name];
      const unitMesh = this._meshes[unit.name];
      unit.position = this.calculateUnitPosition(config);
      const intersections = this.collisionSystem.getIntersections([unit]);

      if (intersections.length > 0 && !unitMesh.material.color.equals(this.collidedColor)) {
        unitMesh.material.setValues({ color: this.collidedColor })
      }

      if (intersections.length == 0 && !unitMesh.material.color.equals(this.uncollidedColor)) {
        unitMesh.material.setValues({ color: this.uncollidedColor })
      }

      unitMesh.position.copy(unit.position);
    })
  }

  // TODO need to control rotation for collision box
  private rotationChanges() {  }

  private generateName(prefix: string) {
    this.idCounter += 1;

    return `${prefix}__${this.idCounter}`;
  }
}
