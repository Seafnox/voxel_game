import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { EntityActivityStatus } from 'src/activity/EntityActivityStatus';
import { ActivityStatusProperty } from 'src/activity/ActivityProperties';
import { RotationProperty } from 'src/positioning/PositioningProperties';
import { isDifferentQuaternion } from 'src/utils/isDifferentQuaternion';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { Quaternion, Vector3 } from 'three';

export class ActivityRotationController extends Controller {
  private deltaTimeScalar = 1000;
  private rotationScalar = 1;
  private defaultRotation = new Quaternion(0,0,0,1);

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(RotationProperty, this.defaultRotation);
//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  tick(deltaTime: number) {
    const activityStatus = this.entity.getProperty<EntityActivityStatus>(ActivityStatusProperty);
    const rotationMultiplier = new Quaternion();
    const rotationDirection = new Vector3(0, 1, 0);
    const targetRotation = this.entity.getProperty<Quaternion>(RotationProperty);
    const calculatedRotation = targetRotation.clone();
    const rotationAngle = this.rotationScalar * Math.PI * deltaTime / this.deltaTimeScalar;

    if (activityStatus.left) {
      rotationMultiplier.setFromAxisAngle(rotationDirection, rotationAngle);
//      console.log('left', rotationAngle, rotationMultiplier.toArray().toString());
    }

    if (activityStatus.right) {
      rotationMultiplier.setFromAxisAngle(rotationDirection, -rotationAngle);
//      console.log('right', rotationAngle, rotationMultiplier.toArray().toString());
    }

    calculatedRotation.multiply(rotationMultiplier);

    if (isDifferentQuaternion(targetRotation, calculatedRotation)) {
      targetRotation.copy(calculatedRotation);
      this.entity.setProperty(RotationProperty, targetRotation);
    }
  }
}
