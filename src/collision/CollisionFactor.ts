import { CollisionBox } from 'src/collision/CollisionBox';
import { Factor } from 'src/engine/Factor';

export class CollisionFactor implements Factor<CollisionBox[]> {
  private _boxes: CollisionBox[] = [];

  get value(): CollisionBox[] {
    return this._boxes;
  }

  register(box: CollisionBox) {
    this._boxes.push(box);
  }
}
