import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { SceneProperty } from 'src/render/SceneProperty';
import { pointToPosition } from 'src/surface/pointToPosition';
import { WaterConfigProperty, WaterConfig } from 'src/surface/WaterConfigProperty';
import { Mesh, DoubleSide, Vector3 } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';

export class SimpleWaterController extends Controller {
  private lastTimeUpdated = 0;
  private waterConfigProperty: WaterConfigProperty;
  private waterMesh: Mesh<ParametricGeometry, MeshPhongMaterial>;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);
    this.lastTimeUpdated = Date.now();

    this.waterConfigProperty = this.engine.properties.find(WaterConfigProperty);
    this.waterMesh = this.createWaterMesh(this.waterConfigProperty.get());

    this.sceneProperty.add(this.waterMesh);

    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.updateSurface.bind(this))
  }

  private get sceneProperty(): SceneProperty {
    return this.engine.properties.find(SceneProperty);
  }

  private createWaterMesh(
    waterConfig: WaterConfig,
  ): Mesh<ParametricGeometry, MeshPhongMaterial> {
    const {mapSize, waterWaveSize, level} = waterConfig;
    const waterGeometry = this.createWaterGeometry(mapSize, waterWaveSize, level);
    const material = new MeshPhongMaterial({
      color: 0x66aaff,
      emissive: 0x001144,
      specular: 0x4499dd,
      side: DoubleSide,
      transparent: true,
      shininess: .8,
      opacity: .6,
      reflectivity: 0.9,
    });

    const waterMesh = new Mesh(waterGeometry, material);

    waterMesh.castShadow = true;
    waterMesh.receiveShadow = false;

    return waterMesh;
  }

  private createWaterGeometry(
    mapSize: number,
    waterWaveSize: number,
    level: Vector3,
  ): ParametricGeometry {
    const calculatePoint = (percentX: number, percentY: number, target: Vector3) => {
      const x = pointToPosition(percentX * (mapSize), mapSize, waterWaveSize);
      const y = pointToPosition(percentY * (mapSize), mapSize, waterWaveSize);
      // TODO Use shader instead, because threeJS can't make underwater lightning
      // @see CameraFocusController.waterLens for hack
//      const z = [
//        Math.sin((x+y)/2)/2,
//        Math.sin((x-y)/2)/2,
//      ].reduce((a, b) => a + b, 0);

      target.set(x, 0, y).add(level);
    };

    return new ParametricGeometry(calculatePoint, mapSize, mapSize);
  }

  private updateSurface(deltaTime: number) {
    this.lastTimeUpdated += deltaTime;
    const levelY = Math.sin(this.lastTimeUpdated/500) - 3;
    this.waterConfigProperty.partialSet({
      level: new Vector3(0, levelY, 0),
    })
    this.waterMesh.position.y = levelY;
  }
}
