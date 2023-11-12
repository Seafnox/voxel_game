import { Emittable } from '../../emitter/Emittable';
import { SystemManager } from './SystemManager';

export interface System extends Emittable {
  name: string;
  systemManager: SystemManager;
  isActive(): boolean;
  setActive(value: boolean): void;
}
