import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { SceneFactor } from 'src/factor/SceneFactor';
import { SurfaceFactor } from 'src/factor/surface/SurfaceFactor';
import { Mesh, Vector3, BackSide, Texture, DataTexture, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';

export class SurfaceController extends Controller {
  private surfaceFactor: SurfaceFactor;
  private sceneFactor: SceneFactor;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
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
      const x = this.surfaceFactor.getMapToCord(percentX * this.surfaceFactor.mapSize);
      const y = this.surfaceFactor.getMapToCord(percentY * this.surfaceFactor.mapSize);
      const z = this.surfaceFactor.getZCord(x,y);
      target.set(x, z, y);
    };
    return new ParametricGeometry(calculatePoint, this.surfaceFactor.mapSize*2, this.surfaceFactor.mapSize*2);
  }

  // TODO make more smooth texture
  private createSurfaceTexture(): Texture {
    const size = this.surfaceFactor.mapSize * this.surfaceFactor.mapSize;
    const data = new Uint8Array( 4 * size );

    for ( let x = 0; x < this.surfaceFactor.mapSize; x++ ) {
      for ( let y = 0; y < this.surfaceFactor.mapSize; y++ ) {
        const stride = (y * this.surfaceFactor.mapSize + x) * 4;
        const color = this.surfaceFactor.getSurfaceMapColor(x,y);
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
