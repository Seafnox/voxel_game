import { RandomFn } from 'simplex-noise/simplex-noise';
import { TopicEmitter } from 'src/emitter/TopicEmitter';
import { EntityManager } from 'src/engine/EntityManager';
import { SystemManager } from 'src/engine/SystemManager';
import { GlobalPropertyManager } from 'src/engine/GlobalPropertyManager';

export class GameEngine extends TopicEmitter {
  private entityManager = new EntityManager(this);
  private systemManager = new SystemManager(this);
  private globalPropertyManager = new GlobalPropertyManager(this);

  constructor(
    private _random: RandomFn,
  ) {
    super();
  }

  get entities(): EntityManager {
    return this.entityManager;
  }

  get systems(): SystemManager {
    return this.systemManager;
  }

  get properties(): GlobalPropertyManager {
    return this.globalPropertyManager;
  }

  get random(): RandomFn {
    return this._random;
  }
}
