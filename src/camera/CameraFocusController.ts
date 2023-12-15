import { CameraFactor } from 'src/camera/CameraFactor';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { WindowEventSystem, WindowTopic, WindowResizeEvent } from 'src/browser/WindowEventSystem';
import { Controller } from 'src/engine/Controller';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { RotationProperty } from 'src/positioning/RotationProperty';
import { SceneFactor } from 'src/render/SceneFactor';
import { WaterFactor } from 'src/surface/WaterFactor';
import { PerspectiveCamera, Quaternion, Vector3, Mesh, SphereGeometry } from 'three';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';

export class CameraFocusController extends Controller {
  private readonly waterLensRotationVector = new Vector3(1,0,0);
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

    this.sceneFactor.add(this.waterLens);

//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  get windowEventSystem(): WindowEventSystem {
    return this.engine.systems.find(WindowEventSystem);
  }

  get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }
  get waterFactor(): WaterFactor {
    return this.engine.factors.find(WaterFactor);
  }

  get cameraFactor(): CameraFactor {
    return this.engine.factors.find(CameraFactor);
  }

  get camera(): PerspectiveCamera {
    return this.cameraFactor.camera;
  }

  get waterLens(): Mesh<SphereGeometry, MeshPhongMaterial> {
    return this.cameraFactor.waterLens;
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

    const underwaterDepth = this.waterFactor.waters[0].position.y - this.camera.position.y;
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
