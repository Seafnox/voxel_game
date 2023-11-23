import { CameraRotationProperty, CameraPositionProperty } from 'src/entity/properties/camera';
import { PositionProperty, RotationProperty } from 'src/entity/properties/visual';
import { TickSystem, TickSystemEvent } from 'src/system/TickSystem';
import { WindowEventSystem, WindowTopic, WindowResizeEvent } from 'src/system/WindowEventSystem';
import { Controller } from 'src/engine/Controller';
import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';

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

    //    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  get windowEventSystem(): WindowEventSystem {
    return this.engine.systems.find(WindowEventSystem);
  }

  getCamera(): PerspectiveCamera {
    return this.camera;
  }

  // TODO change to targetable controller and entity subscription
  setTarget(targetEntity: Entity) {
    this.target = targetEntity;
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
