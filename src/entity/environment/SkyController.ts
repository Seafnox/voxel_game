import { Disposable } from 'src/emitter/SimpleEmitter';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { PositionProperty, FocusEntityProperty } from 'src/entity/properties/visual';
import { SceneFactor } from 'src/factor/SceneFactor';
import skyFragment from 'src/resources/sky.fs';
import skyVertex from 'src/resources/sky.vs';
import { HemisphereLight, Mesh, SphereGeometry, ShaderMaterial, BackSide, Color, Vector3 } from 'three';

export class SkyController extends Controller {
  private backgroundColor = 0xffffcc;
  private skyColor = 0x15c5FF;
  private targetDisposable?: Disposable;
  private skySpere: Mesh;
  private skySphereLight: HemisphereLight;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.skySpere = this.createSkySphere();
    this.skySphereLight = this.createSkySphereLight();

    this.sceneFactor.add(this.skySpere, this.skySphereLight);
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
    this.skySpere.position.x = event.next.x;
    this.skySpere.position.z = event.next.z;
  }

  private createSkySphereLight(): HemisphereLight {
    return new HemisphereLight(this.skyColor, this.backgroundColor, 0.6);
  }

  private createSkySphere(): Mesh {
    const skyGeo = new SphereGeometry(2000, 32, 32);
    const skyMat = new ShaderMaterial({
      uniforms: {
        topColor: {value: new Color(this.skyColor)},
        bottomColor: {value: new Color(this.backgroundColor)},
        offset: {value: 33},
        exponent: {value: 0.6},
      },
      vertexShader: skyVertex,
      fragmentShader: skyFragment,
      side: BackSide,
    });

    return new Mesh(skyGeo, skyMat);
  }
}
