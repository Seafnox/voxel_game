import { WindowEventSystem, WindowEvent, WindowResizeEvent } from 'src/system/WindowEventSystem';
import { Controller } from 'src/engine/Controller';
import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { VisualEntity } from '../VisualEntity';

export class CameraController extends Controller<VisualEntity> {
  private target: VisualEntity | undefined;
  private currentLookAt: Vector3 = new Vector3();
  private readonly camera: PerspectiveCamera;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    if (!(entity instanceof VisualEntity)) {
      throw new Error(`Can't make calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
    }

    super(engine, entity, name);

    const window = this.windowEventSystem.getWindow();
    this.camera = this.createCamera(window);

    this.windowEventSystem.on<WindowResizeEvent>(WindowEvent.Resize, event => {
      const window = event.view!;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  get windowEventSystem(): WindowEventSystem {
    return this.engine.systems.findOne(WindowEventSystem);
  }

  getCamera(): PerspectiveCamera {
    return this.camera;
  }

  setTarget(targetEntity: VisualEntity) {
    this.target = targetEntity;
  }

  calculateIdealOffset(target: VisualEntity) {
    const idealOffset = new Vector3(-0, 10, -15);
    idealOffset.applyQuaternion(target.getRotation());
    idealOffset.add(target.getPosition());
    return idealOffset;
  }

  calculateIdealLookAt(target: VisualEntity) {
    const idealLookAt = new Vector3(0, 5, 20);
    idealLookAt.applyQuaternion(target.getRotation());
    idealLookAt.add(target.getPosition());
    return idealLookAt;
  }

  update(deltaTime: number) {
    if (!this.target) return;
    const entity = this.entity;

    const idealOffset = this.calculateIdealOffset(this.target);
    const idealLookAt = this.calculateIdealLookAt(this.target);

    // const t = 0.05;
    // const t = 4.0 * deltaTime;
    const t = 1.0 - Math.pow(0.01, deltaTime / 1000);
    const currentPosition = entity.getPosition().clone();
    const currentLookAt = this.currentLookAt.clone();
    const currentRotation = new Quaternion();

    currentPosition.lerp(idealOffset, t);
    currentLookAt.lerp(idealLookAt, t);
    currentRotation.setFromUnitVectors(currentPosition, currentLookAt);

    entity.setPosition(currentPosition);
    this.camera.position.copy(currentPosition);

    entity.setRotation(currentRotation);
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
