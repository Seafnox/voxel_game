import { PositionProperty, RotationProperty } from 'src/positioning/PositioningProperties';
import { CameraFactor } from 'src/camera/CameraFactor';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { WindowEventSystem, WindowTopic, WindowResizeEvent } from 'src/browser/WindowEventSystem';
import { Controller } from 'src/engine/Controller';
import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';

export class CameraFocusController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.windowEventSystem.on<WindowResizeEvent>(WindowTopic.Resize, event => {
      const window = event.view!;
      this.cameraFactor.updateAspect(window.innerWidth / window.innerHeight);
    });

    const window = this.windowEventSystem.getWindow();
    this.cameraFactor.updateAspect(window.innerWidth / window.innerHeight);

//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  get windowEventSystem(): WindowEventSystem {
    return this.engine.systems.find(WindowEventSystem);
  }

  get cameraFactor(): CameraFactor {
    return this.engine.factors.find(CameraFactor);
  }

  get camera(): PerspectiveCamera {
    return this.cameraFactor.camera;
  }

  get lookAt(): Vector3 {
    return this.cameraFactor.lookAt;
  }

  private calculateIdealOffset(targerPosition: Vector3, targetRotation: Quaternion): Vector3 {
    const idealOffset = new Vector3(-0, 10, -15);
    idealOffset.applyQuaternion(targetRotation);
    idealOffset.add(targerPosition);
    return idealOffset;
  }

  private calculateIdealLookAt(targerPosition: Vector3, targetRotation: Quaternion): Vector3 {
    const idealLookAt = new Vector3(0, 5, 20);
    idealLookAt.applyQuaternion(targetRotation);
    idealLookAt.add(targerPosition);
    return idealLookAt;
  }

  private tick(deltaTime: number) {
    const targetPosition = this.entity.getProperty<Vector3>(PositionProperty)
    const targetRotation = this.entity.getProperty<Quaternion>(RotationProperty);

    const idealOffset = this.calculateIdealOffset(targetPosition, targetRotation);
    const idealLookAt = this.calculateIdealLookAt(targetPosition, targetRotation);

    const t = 1.0 - Math.pow(0.01, deltaTime / 1000);
    const cameraPosition = this.camera.position.clone();

    cameraPosition.lerp(idealOffset, t);
    this.lookAt.lerp(idealLookAt, t);

    this.camera.position.copy(cameraPosition);
    this.camera.lookAt(this.lookAt);
  }
}
