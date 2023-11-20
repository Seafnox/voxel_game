import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { RotationProperty } from 'src/entity/ActivityRotationController';
import { VelocityProperty } from 'src/entity/VelocityController';
import { isDifferentVector } from 'src/entity/utils/isDifferentVector';
import { SurfaceFactor } from 'src/factor/surface/SurfaceFactor';
import { Vector3, Quaternion } from 'three';

export const PositionProperty = 'position';
export class DynamicPositionController extends Controller {
  private deltaTimeScalar = 1000;
  private defaultPosition = new Vector3(0, 0, 0);
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(PositionProperty, this.defaultPosition);
  }

  private get surfaceFactor(): SurfaceFactor {
    return this.engine.factors.find(SurfaceFactor);
  }

  setNearest(x: number, z: number) {
    const y = this.surfaceFactor.getZCord(x, z);
    this.entity.setProperty(PositionProperty, new Vector3(x,y,z));
  }

  update(deltaTime: number) {
    const velocity = this.entity.getProperty<Vector3>(VelocityProperty);
    const position = this.entity.getProperty<Vector3>(PositionProperty);
    const rotation = this.entity.getProperty<Quaternion>(RotationProperty);

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

    if (isDifferentVector(position, supposedPosition)) {
      position.copy(supposedPosition);
      this.entity.setProperty(PositionProperty, position);
    }
  }

//  // FIXME change to calculation possible supposed position between position and initial supposed position
//  private hasIntersections(pos: Vector3): boolean {
//    // TODO refactoring SpatialGridController to property or change all to own collision system!
//    const grid = this.entity.get<SpatialGridController>(SpatialGridController);
//    const nearby = grid.FindNearbyEntities(5) || [];
//
//    for (let i = 0; i < nearby.length; ++i) {
//      const nearbyEntity = nearby[i].entity;
//      const nearbyPosition = nearbyEntity.getPosition();
//      const distance = ((pos.x - nearbyPosition.x) ** 2 + (pos.z - nearbyPosition.z) ** 2) ** 0.5;
//
//      // FIXME HARDCODED
//      if (distance <= 4) {
//        return true;
//      }
//    }
//    return false;
//  }
}
