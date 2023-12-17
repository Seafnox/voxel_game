import { pointToPosition } from 'src/surface/pointToPosition';
import { Mesh, DoubleSide, Vector3 } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';

export class WaterFactor {
  private waterMeshes: Mesh<ParametricGeometry, MeshPhongMaterial>[] = [];

  get waters(): Mesh<ParametricGeometry, MeshPhongMaterial>[] {
    return this.waterMeshes;
  }

  generateWaters(
    mapSize: number,
    surfaceSize: number,
  ): void {
    this.waterMeshes = Array(1).fill(0).map(() => this.createWaterMesh(mapSize, surfaceSize));
  }

  private createWaterMesh(
    mapSize: number,
    surfaceSize: number,
  ): Mesh<ParametricGeometry, MeshPhongMaterial> {
    const waterGeometry = this.createWaterGeometry(mapSize, surfaceSize);
    const material = new MeshPhongMaterial({
      color: 0x66aaff,
      emissive: 0x001144,
      specular: 0x4499dd,
      side: DoubleSide,
      transparent: true,
      shininess: .8,
      opacity: .6,
      reflectivity: 0.9,
    });

    const waterMesh = new Mesh(waterGeometry, material);

    waterMesh.castShadow = true;
    waterMesh.receiveShadow = false;

    return waterMesh;
  }


  private createWaterGeometry(
    mapSize: number,
    surfaceSize: number,
  ): ParametricGeometry {
    const calculatePoint = (percentX: number, percentY: number, target: Vector3) => {
      const x = pointToPosition(percentX * (mapSize), mapSize, surfaceSize);
      const y = pointToPosition(percentY * (mapSize), mapSize, surfaceSize);
      // TODO Use shader instead, because threeJS can't make underwater lightning
      // @see CameraFocusController.waterLens for hack
//      const z = [
//        Math.sin((x+y)/2)/2,
//        Math.sin((x-y)/2)/2,
//      ].reduce((a, b) => a + b, 0);

      target.set(x, 0, y);
    };

    return new ParametricGeometry(calculatePoint, mapSize, mapSize);
  }
}
