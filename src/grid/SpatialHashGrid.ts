import { Entity } from '../entity/Entity';
import { VMath } from '../VMath';

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
    entity?: Entity;
    _cells: SpatialCell;
    _queryId: number;
}

export class SpatialHashGrid {
    private _bounds: SpatialPoint[] = [];
    private _dimensions: SpatialDimension;
    private _cells: (SpatialNode | undefined)[][];
    private _queryIds: number;

    constructor(bounds: SpatialPoint[], dimensions: SpatialDimension) {
        const [x, y] = dimensions;
        this._cells = new Array(x).fill(0).map(() => new Array(y).fill(undefined).map(() => undefined));
        this._dimensions = dimensions;
        this._bounds = bounds;
        this._queryIds = 0;
    }

    _GetCellIndex(position: SpatialPoint): CellPosition {
        const x = VMath.sat((position[0] - this._bounds[0][0]) / (this._bounds[1][0] - this._bounds[0][0]));
        const y = VMath.sat((position[1] - this._bounds[0][1]) / (this._bounds[1][1] - this._bounds[0][1]));

        const xIndex = Math.floor(x * (this._dimensions[0] - 1));
        const yIndex = Math.floor(y * (this._dimensions[1] - 1));

        return [xIndex, yIndex];
    }

    NewClient(position: SpatialPoint, dimensions: SpatialDimension): SpatialClient {
        const client: SpatialClient = {
            position: position,
            dimensions: dimensions,
            _cells: {
                nodes: [],
            },
            _queryId: -1,
        };

        this._Insert(client);

        return client;
    }

    UpdateClient(client: SpatialClient) {
        const [x, y] = client.position;
        const [w, h] = client.dimensions;

        const i1 = this._GetCellIndex([x - w / 2, y - h / 2]);
        const i2 = this._GetCellIndex([x + w / 2, y + h / 2]);

        if (client._cells.min?.[0] == i1[0] && client._cells.min?.[1] == i1[1]
            && client._cells.max?.[0] == i2[0] && client._cells.max?.[1] == i2[1]
        ) {
            return;
        }

        this.Remove(client);
        this._Insert(client);
    }

    FindNear(position: SpatialPoint, bounds: SpatialPoint): SpatialClient[] {
        const [x, y] = position;
        const [w, h] = bounds;

        const i1 = this._GetCellIndex([x - w / 2, y - h / 2]);
        const i2 = this._GetCellIndex([x + w / 2, y + h / 2]);

        const clients = [];
        const queryId = this._queryIds++;

        for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
            for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
                let head = this._cells[x][y];

                while (head) {
                    const v = head.client;
                    head = head.next;

                    if (v && v._queryId != queryId) {
                        v._queryId = queryId;
                        clients.push(v);
                    }
                }
            }
        }
        return clients;
    }

    _Insert(client: SpatialClient) {
        const [x, y] = client.position;
        const [w, h] = client.dimensions;

        const i1 = this._GetCellIndex([x - w / 2, y - h / 2]);
        const i2 = this._GetCellIndex([x + w / 2, y + h / 2]);

        const nodes: SpatialNode[][] = [];

        for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
            nodes.push([]);

            for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
                const xi = x - i1[0];

                const head: SpatialNode = {
                    client: client,
                };

                nodes[xi].push(head);

                head.next = this._cells[x][y];
                if (this._cells[x][y]) {
                    this._cells[x][y]!.prev = head;
                }

                this._cells[x][y] = head;
            }
        }

        client._cells.min = i1;
        client._cells.max = i2;
        client._cells.nodes = nodes;
    }

    Remove(client: SpatialClient) {
        const i1 = client._cells.min;
        const i2 = client._cells.max;

        if (!i1 || !i2) {
          return;
        }

        for (let x = i1[0], xn = i2[0]; x <= xn; ++x) {
            for (let y = i1[1], yn = i2[1]; y <= yn; ++y) {
                const xi = x - i1[0];
                const yi = y - i1[1];
                const node = client._cells.nodes[xi][yi];

                if (node.next) {
                    node.next.prev = node.prev;
                }
                if (node.prev) {
                    node.prev.next = node.next;
                }

                if (!node.prev) {
                    this._cells[x][y] = node.next;
                }
            }
        }

        client._cells.min = undefined;
        client._cells.max = undefined;
        client._cells.nodes = [];
    }
}
