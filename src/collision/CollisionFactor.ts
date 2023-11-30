import { CollisionBox } from 'src/collision/CollisionBox';
import { Factor } from 'src/engine/Factor';

export class CollisionFactor implements Factor {
  private _boxes: CollisionBox[] = [];

  register(box: CollisionBox) {
    this._boxes.push(box);
  }
}
