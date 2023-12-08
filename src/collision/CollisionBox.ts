import { Vector3 } from 'three';

export class CollisionBox {
  private _min = new Vector3(0,0,0);
  private _max = new Vector3(0,0,0);

  constructor(
    private _name: string,
    private _position: Vector3,
    // private rotation: Quaternion,
    private _size: Vector3,
  ) {
    this.calculateMinMax();
  }

  get max(): Vector3 {
    return this._max.clone();
  }

  get min(): Vector3 {
    return this._min.clone();
  }

  get position(): Vector3 {
    return this._position;
  }

  get size(): Vector3 {
    return this._size;
  }

  get name(): string {
    return this._name;
  }

  set position(position: Vector3) {
    this._position.copy(position);
    this.calculateMinMax();
  }

  clone(): this {
    //@ts-ignore
    return new this.constructor( this._name, this._position, this._size );
  }

  moveUp(delta: Vector3) {
    this._position.add(delta);
    this.calculateMinMax()
  }

  intersectsBox( box: CollisionBox ): boolean {
    const selfMax = this.max;
    const selfMin = this.min;
    const targetMax = box.max;
    const targetMin = box.min;

    // using 4 splitting planes to rule out intersections

    return !([
      targetMax.x < selfMin.x,
      targetMin.x > selfMax.x,
      targetMax.y < selfMin.y,
      targetMin.y > selfMax.y,
      targetMax.z < selfMin.z,
      targetMin.z > selfMax.z,
    ].some(Boolean));

  }

  intersectsSphere( position: Vector3, radius: number ) {

    // Find the point on the AABB closest to the sphere center.
    const nearest = this.nearestBoxPosition( position );

    // If that point is inside the sphere, the AABB and sphere intersect.
    return nearest.distanceToSquared( position ) <= ( radius * radius );

  }

  nearestBoxPosition(position: Vector3 ): Vector3 {

    const result = position.clone();
    result.clamp( this.min, this.max );

    return result;
  }

  distanceToPoint( position: Vector3 ) {
    return this.nearestBoxPosition( position ).distanceTo( position );
  }

  private calculateMinMax() {
    this._min.x = this._position.x - this._size.x/2;
    this._min.y = this._position.y - this._size.y/2;
    this._min.z = this._position.z - this._size.z/2;

    this._max.x = this._position.x + this._size.x/2;
    this._max.y = this._position.y + this._size.y/2;
    this._max.z = this._position.z + this._size.z/2;
  }

}
