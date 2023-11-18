import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { ActivityStatus } from 'src/entity/state/ActivityStatus';
import { ActivityProperty } from 'src/entity/user/KeyboardActivityController';
import { isDifferentQuaternion } from 'src/entity/utils/isDifferentQuaternion';
import { Quaternion, Vector3 } from 'three';

export const RotationProperty = 'rotation';
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
  }

  update(deltaTime: number) {
    const activityStatus = this.entity.getProperty<ActivityStatus>(ActivityProperty);
    const rotationMultiplier = new Quaternion();
    const rotationDirection = new Vector3(0, 1, 0);
    const targetRotation = this.entity.getProperty<Quaternion>(RotationProperty);
    const calculatedRotation = targetRotation.clone();
    const rotationAngle = this.rotationScalar * Math.PI * deltaTime / this.deltaTimeScalar;

    if (activityStatus.left) {
      rotationMultiplier.setFromAxisAngle(rotationDirection, rotationAngle);
    }

    if (activityStatus.right) {
      rotationMultiplier.setFromAxisAngle(rotationDirection, -rotationAngle);
    }

    calculatedRotation.multiply(rotationMultiplier);

    if (isDifferentQuaternion(targetRotation, calculatedRotation)) {
      targetRotation.copy(calculatedRotation);
      this.entity.setProperty(RotationProperty, targetRotation);
    }
  }
}
