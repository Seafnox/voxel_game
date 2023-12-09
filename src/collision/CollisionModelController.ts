import { CollisionBox } from 'src/collision/CollisionBox';
import { CollisionFactor } from 'src/collision/CollisionFactor';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { CollisionUnitsProperty } from 'src/collision/CollisionUnitsProperty';
import { PositionProperty, RotationProperty } from 'src/positioning/PositioningProperties';
import { SceneFactor } from 'src/render/SceneFactor';
import { Vector3, Mesh, BoxGeometry, MeshBasicMaterial, Color } from 'three';

export interface CollisionUnitConfig {
  size: Vector3;
  offset?: Vector3;
}


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

    this.entity.registerProperty(CollisionUnitsProperty, []);
    this.entity.on(PositionProperty, this.positionChanges.bind(this));
    this.entity.on(RotationProperty, this.rotationChanges.bind(this));
  }

  get units(): CollisionBox[] {
    return this.entity.getProperty<CollisionBox[]>(CollisionUnitsProperty);
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
      color: this.uncollidedColor,
      wireframe: true,
    })
    const unitMesh = new Mesh(boxGeometry, unitMaterial);
    unitMesh.position.copy(unit.position);

    this.collisionFactor.register(unit);
    this.units.push(unit);
    this._unitConfigs[unitName] = config;

    this._meshes[unitName] = unitMesh;

    // TODO Make adoptive when convert to global config
    if (this.showMesh) {
      this.sceneFactor.add(unitMesh);
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
      const intersections = this.collisionFactor.getIntersections([unit]);

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
