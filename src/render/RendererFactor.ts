import { WebGLRenderer } from 'three';

export class RendererFactor {
  private _renderer = new WebGLRenderer({
    antialias: true,
  });

  get renderer(): WebGLRenderer {
    return this._renderer;
  }
}
