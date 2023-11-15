import { EntityManager } from 'src/entity/commons/EntityManager';
import { SystemManager } from 'src/entity/commons/SystemManager';
import { FactorManager } from './FactorManager';

export class GameEngine {
  private entityManager = new EntityManager(this);
  private systemManager = new SystemManager(this);
  private factorManager = new FactorManager();

  // TODO make factors for engine. Like Surface, Gravity

  // TODo split controllers to components and Watchers. Combine Watchers with engine Factors and Systems

  get entities(): EntityManager {
    return this.entityManager;
  }

  get systems(): SystemManager {
    return this.systemManager;
  }

  get factors(): FactorManager {
    return this.factorManager;
  }

  // TODO change to Watching system
  update(deltaTime: number) {
    this.entities.filter(entity => entity.isActive).forEach(entity => entity.update(deltaTime));
  }
}
