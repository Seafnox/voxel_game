import { Factor } from 'src/engine/Factor';
import { Scene, Color, FogExp2, Object3D } from 'three';

export class SceneFactor implements Factor<Scene> {
  private _scene: Scene;
  private fogColor = 0x6982ab;
  private backgroundColor = 0xeeffff;

  constructor() {
    this._scene = this.createScene();
  }

  get value(): Scene {
    return this._scene;
  }

  add(...objects: Object3D[]) {
    this._scene.add(...objects);
  }

  private createScene(): Scene {
    const scene = new Scene();
    scene.background = new Color(this.backgroundColor);
    scene.fog = new FogExp2(this.fogColor, 0.002);

    return scene;
  }

}
