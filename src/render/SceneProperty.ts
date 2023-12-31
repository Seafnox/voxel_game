import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty } from 'src/engine/GlobalProperty';
import { Scene, Color, FogExp2, Object3D } from 'three';

export class SceneProperty extends GlobalProperty<Scene> {
  private fogColor = 0x6982ab;
  private backgroundColor = 0xeeffff;

  constructor(
    engine: GameEngine,
    value = new Scene(),
  ) {
    super(engine, value);
    this.configureScene();
  }

  add(...objects: Object3D[]) {
    this.get().add(...objects);
  }

  private configureScene() {
    const scene = this.get();
    scene.background = new Color(this.backgroundColor);
    scene.fog = new FogExp2(this.fogColor, 0.002);
  }

}
