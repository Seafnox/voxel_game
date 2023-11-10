import { Mesh, Vector3, MeshBasicMaterial } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { SpatialHashGrid } from '../../grid/SpatialHashGrid';
import { SurfaceBuilder, SurfacePoint } from '../../grid/SurfaceBuilder';
import { Level } from '../../utils/logger/Level';
import { LogMethod } from '../../utils/logger/LogMethod';
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
    const surfaceBuilder = new SurfaceBuilder(this.mapSize / this.surfaceSize);
    this.surface = surfaceBuilder.getMap(this.mapSize, this.mapSize);
    this.surfaceMesh = this.createSurfaceMesh();
  }

  private createSurfaceMesh(): Mesh {
    const calculatePoint = (percentX: number, percentY: number, target: Vector3): void => {
      const surfaceX = Math.floor(percentX * (this.mapSize - 1));
      const surfaceY = Math.floor(percentY * (this.mapSize - 1));
      const x = Math.floor(percentX * (this.surfaceSize - 1) - this.surfaceSize / 2);
      const y = Math.floor(percentY * (this.surfaceSize - 1) - this.surfaceSize / 2);
      const z = VMath.lerp(this.surface[surfaceX][surfaceY].value, -50, 50);
      target.set(x, y, z);
    };
    const geometry = new ParametricGeometry(calculatePoint, this.mapSize, this.mapSize);
    const baseMaterial = new MeshBasicMaterial({
      color: this.groundColor,
      wireframe: true,
      wireframeLinewidth: 4,
    });
    const surfaceMesh = new Mesh(geometry, baseMaterial);

    surfaceMesh.castShadow = false;
    surfaceMesh.receiveShadow = true;
    surfaceMesh.rotation.x = -Math.PI / 2;

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

  public getSurfacePoint(xCord: number, yCord: number): SurfacePoint {
    const x = Math.floor(xCord * (this.mapSize/this.surfaceSize));
    const y = Math.floor(yCord * (this.mapSize/this.surfaceSize));
    return this.surface[x][y];
  }
}
