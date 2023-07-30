import { Entity } from './Entity';

export interface Component {
  entity: Entity | undefined;
  initComponent(): void;
  update(timeElapsed: number): void;
}
