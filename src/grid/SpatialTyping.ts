import { VisualEntity } from 'src/entity/visualEntity/VisualEntity';

export type SpatialPoint = [number, number];
export type SpatialDimension = [number, number];
export type CellPosition = [number, number];

export interface SpatialCell {
    min?: CellPosition;
    max?: CellPosition;
    nodes: SpatialNode[][];
}

export interface SpatialNode {
    next?: SpatialNode;
    prev?: SpatialNode;
    client?: SpatialClient;
}

export interface SpatialClient {
    position: SpatialPoint;
    dimensions: SpatialDimension;
    entity: VisualEntity;
    _cells: SpatialCell;
    _queryId: number;
}
