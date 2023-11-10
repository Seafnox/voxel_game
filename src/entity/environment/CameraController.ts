import { WindowEventObserver } from '../../observers/WindowEventObserver';
import { WindowTopic } from '../../observers/WindowTopic';
import { Controller } from '../commons/Controller';
import { PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { VisualEntity } from '../commons/VisualEntity';

export class CameraController implements Controller {
  entity: VisualEntity | undefined;

  private target: VisualEntity | undefined;
  private currentLookAt: Vector3 = new Vector3();
  private readonly camera: PerspectiveCamera;

  constructor(
    private windowObserver: WindowEventObserver,
  ) {
    const window = this.windowObserver.getWindow();
    this.camera = this.createCamera(window);

    this.windowObserver.on<UIEvent>(WindowTopic.Resize, event => {
      const window = event.value.view!;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });
  }

  getCamera(): PerspectiveCamera {
    return this.camera;
  }

  private createCamera(window: WindowProxy): PerspectiveCamera {
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 1.0;
    const far = 10000.0;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(
      0,
      5,
      25);

    camera.updateProjectionMatrix();

    return camera;
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
    if (!this.entity) return;

    const idealOffset = this.calculateIdealOffset(this.target);
    const idealLookAt = this.calculateIdealLookAt(this.target);

    // const t = 0.05;
    // const t = 4.0 * deltaTime;
    const t = 1.0 - Math.pow(0.01, deltaTime / 1000);
    const currentPosition = this.entity.getPosition().clone();
    const currentLookAt = this.currentLookAt.clone();
    const currentRotation = new Quaternion();

    currentPosition.lerp(idealOffset, t);
    currentLookAt.lerp(idealLookAt, t);
    currentRotation.setFromUnitVectors(currentPosition, currentLookAt);

    this.entity.setPosition(currentPosition);
    this.entity.setRotation(currentRotation);
    this.currentLookAt.copy(currentLookAt);

    this.camera.position.copy(currentPosition);
    this.camera.lookAt(this.currentLookAt);
  }

  focusCameraOn(target: VisualEntity) {
    this.target = target;
  }
}
