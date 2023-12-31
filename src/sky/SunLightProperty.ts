import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty } from 'src/engine/GlobalProperty';
import { DirectionalLight } from 'three';

export class SunLightProperty extends GlobalProperty<DirectionalLight> {
  constructor(
    engine: GameEngine,
    value = new DirectionalLight(0xeeffff, 1.0),
  ) {
    super(engine, value);

    this.configureLight()
  }

  private configureLight(): DirectionalLight {
    const light = this.get();

    light.position.set(0, 800, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 2000.0;
    light.shadow.camera.left = 600;
    light.shadow.camera.right = -600;
    light.shadow.camera.top = 600;
    light.shadow.camera.bottom = -600;
    light.shadow.radius = 5;
    light.shadow.blurSamples = 25;

    return light;
  }
}
