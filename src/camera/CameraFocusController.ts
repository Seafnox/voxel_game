import { CameraProperty } from 'src/camera/CameraProperty';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { WindowEventSystem, WindowTopic, WindowResizeEvent } from 'src/browser/WindowEventSystem';
import { Controller } from 'src/engine/Controller';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { RotationProperty } from 'src/positioning/RotationProperty';
import { SceneProperty } from 'src/render/SceneProperty';
import { WaterConfigProperty } from 'src/surface/WaterConfigProperty';
import { PerspectiveCamera, Quaternion, Vector3, Mesh, SphereGeometry } from 'three';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';

export class CameraFocusController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.windowEventSystem.on<WindowResizeEvent>(WindowTopic.Resize, event => {
      const window = event.view!;
      this.cameraProperty.updateAspect(window.innerWidth / window.innerHeight);
    });

    const window = this.windowEventSystem.getWindow();
    this.cameraProperty.updateAspect(window.innerWidth / window.innerHeight);

    this.sceneProperty.add(this.waterLens);

//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  get windowEventSystem(): WindowEventSystem {
    return this.engine.systems.find(WindowEventSystem);
  }

  get sceneProperty(): SceneProperty {
    return this.engine.properties.find(SceneProperty);
  }
  get waterLevel(): Vector3 {
    return this.engine.properties.find(WaterConfigProperty).get().level;
  }

  get cameraProperty(): CameraProperty {
    return this.engine.properties.find(CameraProperty);
  }

  get camera(): PerspectiveCamera {
    return this.cameraProperty.get();
  }

  get waterLens(): Mesh<SphereGeometry, MeshPhongMaterial> {
    return this.cameraProperty.waterLens;
  }

  get lookAt(): Vector3 {
    return this.cameraProperty.lookAt;
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
    const targetPosition = this.entity.properties.find(PositionProperty).get();
    const targetRotation = this.entity.properties.find(RotationProperty).get();

    const idealOffset = this.calculateIdealOffset(targetPosition, targetRotation);
    const idealLookAt = this.calculateIdealLookAt(targetPosition, targetRotation);

    const t = 1.0 - Math.pow(0.01, deltaTime / 1000);
    const cameraPosition = this.camera.position.clone();

    cameraPosition.lerp(idealOffset, t);
    this.lookAt.lerp(idealLookAt, t);

    this.camera.position.copy(cameraPosition);
    this.camera.lookAt(this.lookAt);

    this.waterLens.position.copy(this.camera.position);
//    this.waterLens.position.copy(this.lookAt);
    this.waterLens.quaternion.copy(this.camera.quaternion);

    const underwaterDepth = this.waterLevel.y - this.camera.position.y;
    const depthLimit = 2;
    const recalcDepth = underwaterDepth > depthLimit
      ? depthLimit
      : underwaterDepth < -depthLimit
        ? -depthLimit
        : underwaterDepth;

    // this is wrong formula but it works fine
    const angle = (recalcDepth * 2 + 1/3)/(depthLimit) + Math.PI/2;
    this.waterLens.rotateX(angle);
  }
}
