import { CollisionBox } from 'src/models/collision/CollisionBox';
import { EventSystem } from 'src/engine/EventSystem';

export class CollisionSystem extends EventSystem {
  private _units: CollisionBox[] = [];

  register(unit: CollisionBox) {
    this._units.push(unit);
  }

  getIntersections(inspectedUnits: CollisionBox[], exceptUnits: CollisionBox[] = []): CollisionBox[] {
    const collisionUnits = this._units.filter(unit => !inspectedUnits.includes(unit) && !exceptUnits.includes(unit));

    return inspectedUnits.reduce((result, inspectedUnit) => {
      const intersections = collisionUnits.filter(unit => inspectedUnit.intersectsBox(unit));

      result.push(...intersections);

      return result;
    }, [] as CollisionBox[]);
  }
}
