import { Mesh, Vector3, MeshBasicMaterial, BackSide, Texture, DataTexture } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { SpatialHashGrid } from '../../grid/SpatialHashGrid';
import { SurfaceBuilder, SurfacePoint } from '../../grid/SurfaceBuilder';
import { VMath } from '../../VMath';
import { Controller } from '../commons/Controller';
import { Entity } from '../commons/Entity';

export class SurfaceController implements Controller {
  public entity: Entity | undefined;

  private gridSize: number;
  private gridDimension: number;
  private grid: SpatialHashGrid;
  private surface: SurfacePoint[][];
  private surfaceMesh: Mesh;

  constructor(
    private mapSize: number,
    private surfaceSize: number,
    private groundColor: number,
  ) {
    this.gridSize = this.surfaceSize / 4;
    this.gridDimension = this.surfaceSize / this.mapSize;
    this.grid = new SpatialHashGrid(
      [[-this.gridSize, -this.gridSize], [this.gridSize, this.gridSize]],
      [this.gridDimension, this.gridDimension]
    );
    const surfaceBuilder = new SurfaceBuilder(0.005 * this.surfaceSize / this.mapSize);
    this.surface = surfaceBuilder.getMap(this.mapSize, this.mapSize);
    this.surfaceMesh = this.createSurfaceMesh();
  }

  private createSurfaceMesh(): Mesh {
    const calculatePoint = (percentX: number, percentY: number, target: Vector3): void => {
      const x = Math.floor(percentX * (this.surfaceSize - 1) - this.surfaceSize / 2);
      const y = Math.floor(percentY * (this.surfaceSize - 1) - this.surfaceSize / 2);
      const z = this.getZCord(x,y);
      target.set(x, z, y);
    };
    const geometry = new ParametricGeometry(calculatePoint, this.mapSize, this.mapSize);
    const texture = this.createSurfaceTexture();
//    const material = new MeshBasicMaterial({
//      color: this.groundColor,
//      //wireframe: true,
//      wireframeLinewidth: 4,
//      side: BackSide,
//    });
    const material = new MeshBasicMaterial({
      map: texture,
      side: BackSide,
//      wireframe: true,
      wireframeLinewidth: 4,
    })
    const surfaceMesh = new Mesh(geometry, material);

    surfaceMesh.castShadow = false;
    surfaceMesh.receiveShadow = true;

    return surfaceMesh;
  }

  getSurfaceMesh(): Mesh {
    return this.surfaceMesh;
  }

  getGrid(): SpatialHashGrid {
    return this.grid;
  }

  onEntityChange() {}
  update(): void {}

  getZCord(xCord: number, yCord: number): number {
    return this.getZCordByPoint(this.getSurfacePoint(xCord, yCord))
  }
  getMapIndex(cord: number): number {
    return Math.floor(cord * (this.mapSize/this.surfaceSize) + this.mapSize/2);
  }

  getSurfacePoint(xCord: number, yCord: number): SurfacePoint {
    const x = this.getMapIndex(xCord);
    const y = this.getMapIndex(yCord);
    return this.surface[x][y];
  }

  private getZCordByPoint(point: SurfacePoint): number {
    return VMath.lerp(point.value, -100, 100);
  }

  private createSurfaceTexture(): Texture {
    const size = this.mapSize * this.mapSize;
    const data = new Uint8Array( 4 * size );

    for ( let x = 0; x < this.mapSize; x++ ) {
      for ( let y = 0; y < this.mapSize; y++ ) {
        const stride = (x * this.mapSize + y) * 4;
        const color = this.surface[y][x].color;
        data[ stride ] = color[0];
        data[ stride + 1 ] = color[1];
        data[ stride + 2 ] = color[2];
        data[ stride + 3 ] = 255;
      }
    }

    // used the buffer to create a DataTexture
    const texture = new DataTexture( data, this.mapSize, this.mapSize );
    texture.needsUpdate = true;

    return texture;
  }
}
