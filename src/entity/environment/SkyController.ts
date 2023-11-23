import { Disposable } from 'src/emitter/SimpleEmitter';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { UpdatePropertyEvent } from 'src/engine/UpdatePropertyEvent';
import { PositionProperty } from 'src/entity/properties/visual';
import { SceneFactor } from 'src/factor/SceneFactor';
import skyFragment from 'src/resources/sky.fs';
import skyVertex from 'src/resources/sky.vs';
import { HemisphereLight, Mesh, SphereGeometry, ShaderMaterial, BackSide, Color, Vector3 } from 'three';

export class SkyController extends Controller {
  private backgroundColor = 0xffffcc;
  private skyColor = 0x15c5FF;
  private target: Entity | undefined;
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
  }

  get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }

  // TODO change to targetable controller and entity subscription
  setTarget(targetEntity: Entity) {
    this.target = targetEntity;
    this.targetDisposable?.dispose();
    this.targetDisposable = this.target.on<UpdatePropertyEvent<Vector3>>(PositionProperty, this.targetPropertyChange.bind(this));
  }

  private targetPropertyChange(event: UpdatePropertyEvent<Vector3>) {
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
