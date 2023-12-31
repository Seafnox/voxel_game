import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty } from 'src/engine/GlobalProperty';
import { WebGLRenderer } from 'three';

export class RendererProperty extends GlobalProperty<WebGLRenderer> {
  constructor(
    engine: GameEngine,
    value = new WebGLRenderer({
      antialias: true,
    }),
  ) {
    super(engine, value);
  }
}
