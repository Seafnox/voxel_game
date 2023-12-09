import { PerspectiveCamera, Vector3 } from 'three';

export class CameraFactor {
  readonly camera: PerspectiveCamera;
  readonly lookAt = new Vector3(0,0,0);

  constructor() {
    this.camera = this.createCamera();
  }

  updateAspect(aspect: number) {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  private createCamera(): PerspectiveCamera {
    const fov = 60;
    const aspect = 1.6;
    const near = 1.0;
    const far = 6000.0;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(
      0,
      0,
      25);

    camera.updateProjectionMatrix();

    return camera;
  }
}
