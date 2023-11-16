import { EntityManager } from 'src/engine/EntityManager';
import { SystemManager } from 'src/engine/SystemManager';
import { FactorManager } from './FactorManager';

export class GameEngine {
  private entityManager = new EntityManager(this);
  private systemManager = new SystemManager(this);
  private factorManager = new FactorManager();

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
