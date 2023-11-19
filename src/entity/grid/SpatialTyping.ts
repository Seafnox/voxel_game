import { Entity } from 'src/engine/Entity';

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
    entity: Entity;
    _cells: SpatialCell;
    _queryId: number;
}
