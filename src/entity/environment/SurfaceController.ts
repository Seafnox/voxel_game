import { Mesh, Vector3, BackSide, Texture, DataTexture, Scene, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { BufferGeometry } from 'three/src/core/BufferGeometry';
import { SurfaceFactor } from '../../factor/surface/SurfaceFactor';
import { SpatialHashGrid } from '../../grid/SpatialHashGrid';
import { Controller } from '../../engine/Controller';
import { Entity } from '../../engine/Entity';
import { GameEngine } from '../../engine/GameEngine';

export class SurfaceController extends Controller {
  private surfaceFactor: SurfaceFactor;

  constructor(
    private scene: Scene,
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.surfaceFactor = this.engine.factors.findOne(SurfaceFactor);

    this.scene.add(this.createSurfaceWireframeMesh());
    this.scene.add(this.createSurfaceMesh());
  }

  // FIXME refactor and remove
  getGrid(): SpatialHashGrid {
    return this.surfaceFactor.grid;
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

  private createSurfaceGeometry(): BufferGeometry {
    const calculatePoint = (percentX: number, percentY: number, target: Vector3) => {
      const x = (percentX - 0.5) * (this.surfaceFactor.mapSize-1) * this.surfaceFactor.surfaceScale;
      const y = (percentY - 0.5) * (this.surfaceFactor.mapSize-1) * this.surfaceFactor.surfaceScale;
      const z = this.surfaceFactor.getZCord(x,y);
      target.set(x, z, y);
    };
    const geometry = new ParametricGeometry(calculatePoint, this.surfaceFactor.mapSize, this.surfaceFactor.mapSize);

    return geometry;
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
