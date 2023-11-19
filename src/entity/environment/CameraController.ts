import { RotationProperty } from 'src/entity/ActivityRotationController';
import { PositionProperty } from 'src/entity/PositionController';
import { WindowEventSystem, WindowTopic, WindowResizeEvent } from 'src/system/WindowEventSystem';
import { Controller } from 'src/engine/Controller';
import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';

export const CameraRotationProperty = 'rotation';
export const CameraPositionProperty = 'position';

export class CameraController extends Controller {
  private target: Entity | undefined;
  private currentLookAt: Vector3 = new Vector3();
  private readonly camera: PerspectiveCamera;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.registerProperty(CameraRotationProperty, new Quaternion(0,0,0,1));
    this.entity.registerProperty(CameraPositionProperty, new Vector3(0,0,0));

    const window = this.windowEventSystem.getWindow();
    this.camera = this.createCamera(window);

    this.windowEventSystem.on<WindowResizeEvent>(WindowTopic.Resize, event => {
      const window = event.view!;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  get windowEventSystem(): WindowEventSystem {
    return this.engine.systems.find(WindowEventSystem);
  }

  getCamera(): PerspectiveCamera {
    return this.camera;
  }

  setTarget(targetEntity: Entity) {
    this.target = targetEntity;
  }

  calculateIdealOffset(targerPosition: Vector3, targetRotation: Quaternion): Vector3 {
    const idealOffset = new Vector3(-0, 10, -15);
    idealOffset.applyQuaternion(targetRotation);
    idealOffset.add(targerPosition);
    return idealOffset;
  }

  calculateIdealLookAt(targerPosition: Vector3, targetRotation: Quaternion): Vector3 {
    const idealLookAt = new Vector3(0, 5, 20);
    idealLookAt.applyQuaternion(targetRotation);
    idealLookAt.add(targerPosition);
    return idealLookAt;
  }

  update(deltaTime: number) {
    if (!this.target) return;
    const entity = this.entity;
    const targetPosition = this.target.getProperty<Vector3>(PositionProperty)
    const targetRotation = this.target.getProperty<Quaternion>(RotationProperty);

    const idealOffset = this.calculateIdealOffset(targetPosition, targetRotation);
    const idealLookAt = this.calculateIdealLookAt(targetPosition, targetRotation);

    // const t = 0.05;
    // const t = 4.0 * deltaTime;
    const t = 1.0 - Math.pow(0.01, deltaTime / 1000);
    const currentPosition = entity.getProperty<Vector3>(CameraPositionProperty).clone();
    const currentLookAt = this.currentLookAt.clone();
    const currentRotation = new Quaternion();

    currentPosition.lerp(idealOffset, t);
    currentLookAt.lerp(idealLookAt, t);
    currentRotation.setFromUnitVectors(currentPosition, currentLookAt);

    entity.setProperty(CameraPositionProperty, currentPosition);
    this.camera.position.copy(currentPosition);

    entity.setProperty(CameraRotationProperty, currentRotation);
    this.currentLookAt.copy(currentLookAt);
    this.camera.lookAt(this.currentLookAt);
  }

  private createCamera(window: WindowProxy): PerspectiveCamera {
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 10000.0;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(
      0,
      0,
      25);

    camera.updateProjectionMatrix();

    return camera;
  }
}
