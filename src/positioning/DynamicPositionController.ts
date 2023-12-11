import { CollisionBox } from 'src/collision/CollisionBox';
import { CollisionFactor } from 'src/collision/CollisionFactor';
import { CollisionUnitsProperty } from 'src/collision/CollisionUnitsProperty';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { RotationProperty } from 'src/positioning/RotationProperty';
import { isDifferentVector } from 'src/utils/isDifferentVector';
import { SurfaceFactor } from 'src/surface/SurfaceFactor';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { VelocityProperty } from 'src/velocity/VelocityProperty';
import { Vector3 } from 'three';

export class DynamicPositionController extends Controller {
  private deltaTimeScalar = 1000;
  private defaultPosition = new Vector3(0, 0, 0);

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.properties.register(PositionProperty, this.defaultPosition);
//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  private get surfaceFactor(): SurfaceFactor {
    return this.engine.factors.find(SurfaceFactor);
  }

  private get collisionUnits(): CollisionBox[] {
    return this.entity.properties.find(CollisionUnitsProperty).get();
  }

  private get collisionFactor(): CollisionFactor {
    return this.engine.factors.find(CollisionFactor);
  }

  private get positionProperty(): PositionProperty {
    return this.entity.properties.find(PositionProperty);
  }

  setNearest(x: number, z: number) {
    const y = this.surfaceFactor.getZCord(x, z);
    this.positionProperty.set(new Vector3(x,y,z));
  }

  tick(deltaTime: number) {
    const position = this.positionProperty.get();
    const velocity = this.entity.properties.find(VelocityProperty).get();
    const rotation = this.entity.properties.find(RotationProperty).get();

    const forward = new Vector3(0, 0, 1);
    forward.applyQuaternion(rotation);
    forward.normalize();

    const sideways = new Vector3(1, 0, 0);
    sideways.applyQuaternion(rotation);
    sideways.normalize();

    const verticalWays = new Vector3(0, 1, 0);
    sideways.applyQuaternion(rotation);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * deltaTime / this.deltaTimeScalar);
    verticalWays.multiplyScalar(velocity.y * deltaTime / this.deltaTimeScalar);
    forward.multiplyScalar(velocity.z * deltaTime / this.deltaTimeScalar);

    const supposedPosition = position.clone();
    supposedPosition.add(forward);
    supposedPosition.add(verticalWays);
    supposedPosition.add(sideways);

    // TODO Add collision System
    const surfaceY = this.surfaceFactor.getZCord(supposedPosition.x, supposedPosition.z);
    if (supposedPosition.y < surfaceY) {
      supposedPosition.y = surfaceY;
    }

    if (isDifferentVector(position, supposedPosition)) {
      if (this.pathIsClear(position, supposedPosition)) {
        position.copy(supposedPosition);
        this.positionProperty.set(position);
      }
    }
  }

  // TODO add pathchecking (half delta check, quarter delta check, etc)
  private pathIsClear(prevPosition: Vector3, nextPosition: Vector3): boolean {
    if (!this.entity.properties.has(CollisionUnitsProperty)) return true;

    const delta = nextPosition.clone().sub(prevPosition);
    const nextCollisionUnits = this.collisionUnits.map(unit => unit.clone());
    nextCollisionUnits.forEach(unit => unit.moveUp(delta));
    const nextIntersections = this.collisionFactor.getIntersections(nextCollisionUnits, this.collisionUnits);

    return !nextIntersections.length;
  }
}
