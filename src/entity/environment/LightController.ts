import { SceneFactor } from 'src/factor/SceneFactor';
import { Controller } from 'src/engine/Controller';
import { DirectionalLight } from 'three';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { VisualEntity } from '../VisualEntity';

export class LightController extends Controller {
  private lightColor = 0xeeffff;
  private target: VisualEntity | undefined;
  private light: DirectionalLight;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.light = this.createLight();

    this.sceneFactor.add(this.light, this.light.target);
  }

  get sceneFactor(): SceneFactor {
    return this.engine.factors.findOne(SceneFactor);
  }

  setTarget(targetEntity: VisualEntity) {
    this.target = targetEntity;
  }

  update() {
    if (!this.target) return;

    this.light.target.position.copy(this.target.getPosition());
  }

  private createLight(): DirectionalLight {
    const light = new DirectionalLight(this.lightColor, 1.0);
    light.position.set(0, 800, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 1000.0;
    light.shadow.camera.left = 150;
    light.shadow.camera.right = -150;
    light.shadow.camera.top = 150;
    light.shadow.camera.bottom = -150;
    light.shadow.radius = 5;
    light.shadow.blurSamples = 25;

    return light;
  }
}
