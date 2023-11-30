import { Factor } from 'src/engine/Factor';
import { SpatialHashGrid } from 'src/entity/grid/SpatialHashGrid';

export class SpatialFactor implements Factor {
  private _grid: SpatialHashGrid = this.createSpatialGrid(0,0);

  get grid(): SpatialHashGrid {
    return this._grid;
  }

  generateGrid(
    gridSize: number,
    gridDimension: number,
  ) {
    this._grid = this.createSpatialGrid(gridSize, gridDimension);
  }

  private createSpatialGrid(
    gridSize: number,
    gridDimension: number,
  ): SpatialHashGrid {
    return new SpatialHashGrid(
      [[-gridSize, -gridSize], [gridSize, gridSize]],
      [gridDimension, gridDimension]
    );
  }
}
