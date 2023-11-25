import { Disposable } from 'src/emitter/SimpleEmitter';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { PositionProperty, FocusEntityProperty } from 'src/entity/properties/visual';
import { SceneFactor } from 'src/factor/SceneFactor';
import { Controller } from 'src/engine/Controller';
import { DirectionalLight, Vector3 } from 'three';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';

export class LightController extends Controller {
  private lightColor = 0xeeffff;
  private targetDisposable?: Disposable;
  private light: DirectionalLight;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.light = this.createLight();

    this.sceneFactor.add(this.light, this.light.target);
    this.entity.on(FocusEntityProperty, this.onTargetChange.bind(this));
  }

  get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }

  private onTargetChange(event: UpdatePropertyEvent<Entity | undefined>) {
    this.targetDisposable?.dispose();
    if (event.next) {
      this.targetDisposable = event.next?.on<UpdatePropertyEvent<Vector3>>(PositionProperty, this.targetPositionChange.bind(this));
      this.targetPositionChange({
        prev: undefined,
        next: event.next?.getProperty<Vector3>(PositionProperty),
      })
    }
  }

  private targetPositionChange(event: UpdatePropertyEvent<Vector3>) {
    this.light.target.position.copy(event.next);

    this.light.position.x = event.next.x;
    this.light.position.z = event.next.z;
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
