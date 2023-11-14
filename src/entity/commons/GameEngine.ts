import { EntityManager } from 'src/entity/commons/EntityManager';
import { SystemManager } from 'src/entity/commons/SystemManager';

export class GameEngine {
  private entityManager = new EntityManager(this);
  private systemManager = new SystemManager(this);


  // TODO make factors for engine. Like Surface, Gravity

  // TODo split controllers to components and Watchers. Combine Watchers with engine Factors and Systems

  get entities(): EntityManager {
    return this.entityManager;
  }

  get systems(): SystemManager {
    return this.systemManager;
  }

  // TODO change to Watching system
  update(deltaTime: number) {
    this.entities.filter(entity => entity.isActive).forEach(entity => entity.update(deltaTime));
  }
}
