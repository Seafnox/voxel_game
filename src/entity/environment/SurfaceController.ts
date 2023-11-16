import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { VisualEntity } from 'src/entity/VisualEntity';
import { SceneFactor } from 'src/factor/SceneFactor';
import { SurfaceFactor } from 'src/factor/surface/SurfaceFactor';
import { Mesh, Vector3, BackSide, Texture, DataTexture, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';

export class SurfaceController extends Controller<VisualEntity> {
  private surfaceFactor: SurfaceFactor;
  private sceneFactor: SceneFactor;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    if (!(entity instanceof VisualEntity)) {
      throw new Error(`Can't make calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
    }

    super(engine, entity, name);

    this.surfaceFactor = this.engine.factors.find(SurfaceFactor);
    this.sceneFactor = this.engine.factors.find(SceneFactor);

    this.sceneFactor.add(this.createSurfaceWireframeMesh());
    this.sceneFactor.add(this.createSurfaceMesh());
  }

  private createSurfaceMesh(): Mesh {
    const geometry = this.createSurfaceGeometry();
    const texture = this.createSurfaceTexture();
    const material = new MeshStandardMaterial({
      color: 0xFFFFFF,
      map: texture,
      side: BackSide,
    });
    const surfaceMesh = new Mesh(geometry, material);

    surfaceMesh.castShadow = false;
    surfaceMesh.receiveShadow = true;

    return surfaceMesh;
  }

  private createSurfaceWireframeMesh(): Mesh {
    const geometry = this.createSurfaceGeometry();
    const material = new MeshBasicMaterial({
      wireframe: true,
      wireframeLinewidth: 4,
    });
    const surfaceMesh = new Mesh(geometry, material);

    surfaceMesh.castShadow = false;
    surfaceMesh.receiveShadow = true;

    return surfaceMesh;
  }

  private createSurfaceGeometry(): ParametricGeometry {
    const calculatePoint = (percentX: number, percentY: number, target: Vector3) => {
      const x = (percentX - 0.5) * (this.surfaceFactor.mapSize-1) * this.surfaceFactor.surfaceScale;
      const y = (percentY - 0.5) * (this.surfaceFactor.mapSize-1) * this.surfaceFactor.surfaceScale;
      const z = this.surfaceFactor.getZCord(x,y);
      target.set(x, z, y);
    };
    return new ParametricGeometry(calculatePoint, this.surfaceFactor.mapSize, this.surfaceFactor.mapSize);
  }

  private createSurfaceTexture(): Texture {
    const size = this.surfaceFactor.mapSize * this.surfaceFactor.mapSize;
    const data = new Uint8Array( 4 * size );

    for ( let x = 0; x < this.surfaceFactor.mapSize; x++ ) {
      for ( let y = 0; y < this.surfaceFactor.mapSize; y++ ) {
        const stride = (x * this.surfaceFactor.mapSize + y) * 4;
        const color = this.surfaceFactor.surfaceMap[y][x].color;
        data[ stride ] = color[0];
        data[ stride + 1 ] = color[1];
        data[ stride + 2 ] = color[2];
        data[ stride + 3 ] = 255;
      }
    }

    // used the buffer to create a DataTexture
    const texture = new DataTexture( data, this.surfaceFactor.mapSize, this.surfaceFactor.mapSize );
    texture.needsUpdate = true;

    return texture;
  }
}
