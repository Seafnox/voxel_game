import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty } from 'src/engine/GlobalProperty';
import { PerspectiveCamera, Vector3, Mesh, SphereGeometry, BackSide } from 'three';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';

const fov = 60;
const aspect = 1.6;
const near = 1.0;
const far = 6000.0;

export class CameraProperty extends GlobalProperty<PerspectiveCamera> {
  readonly lookAt = new Vector3(0,0,0);
  readonly waterLensGeometry = new SphereGeometry(5, 10, 10, 0, Math.PI)
  readonly waterLensMaterial = new MeshPhongMaterial({
    color: 0x66aaff,
    emissive: 0x001144,
    specular: 0x3388aa,
    side: BackSide,
    transparent: true,
    shininess: .8,
    opacity: .5,
  })
  readonly waterLens = new Mesh(this.waterLensGeometry, this.waterLensMaterial);

  constructor(
    engine: GameEngine,
    value: PerspectiveCamera = new PerspectiveCamera(fov, aspect, near, far),
  ) {
    super(engine, value);

    this.waterLens.geometry.rotateZ(-Math.PI/2);
    this.configureCamera();
  }

  updateAspect(aspect: number) {
    const camera = this.get();
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }

  private configureCamera() {
    const camera = this.get();
    camera.position.set(0, 0, 25);

    camera.updateProjectionMatrix();
  }
}
