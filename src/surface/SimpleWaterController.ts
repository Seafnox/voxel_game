import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { SceneFactor } from 'src/render/SceneFactor';
import { WaterFactor } from 'src/surface/WaterFactor';

export class SimpleWaterController extends Controller {
  private lastTimeUpdated = 0;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);
    this.lastTimeUpdated = Date.now();

    this.sceneFactor.add(...this.waterFactor.waters);

    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.updateSurface.bind(this))
  }

  private get waterFactor(): WaterFactor {
    return this.engine.factors.find(WaterFactor);
  }

  private get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }

  private updateSurface(deltaTime: number) {
    this.lastTimeUpdated += deltaTime;
    this.waterFactor.waters.forEach((waterMesh, index) =>
      waterMesh.position.y = Math.sin(this.lastTimeUpdated/500) - 3 - 0.6 * index);
  }
}
