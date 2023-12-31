import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { SceneProperty } from 'src/render/SceneProperty';
import { SurfaceHelperSystem } from 'src/surface/SurfaceHelperSystem';
import { Mesh, Vector3, DoubleSide } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';

export class SuperWaterController extends Controller {
  private lastTimeUpdated = 0;
  private waterGeometry: ParametricGeometry = new ParametricGeometry();

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.sceneProperty.add(this.createWaterMesh());

    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.updateSurface.bind(this))
  }

  private get surfaceHelper(): SurfaceHelperSystem {
    return this.engine.systems.find(SurfaceHelperSystem);
  }

  private get sceneProperty(): SceneProperty {
    return this.engine.properties.find(SceneProperty);
  }

  private createWaterMesh(): Mesh {
    this.lastTimeUpdated = Date.now();
    this.waterGeometry = this.createWaterGeometry();
    const material = new MeshPhongMaterial({
      color: 0x66aaff,
      side: DoubleSide,
      transparent: true,
      reflectivity: .8,
      opacity: .8,
      flatShading: true,
    });
    const surfaceMesh = new Mesh(this.waterGeometry, material);

    surfaceMesh.castShadow = false;
    surfaceMesh.receiveShadow = true;

    return surfaceMesh;
  }

  private createWaterGeometry(): ParametricGeometry {
    const mapSize = this.surfaceHelper.mapSize;
    const calculatePoint = (percentX: number, percentY: number, target: Vector3) => {
      const x = this.surfaceHelper.getMapToCord(percentX * (mapSize));
      const y = this.surfaceHelper.getMapToCord(percentY * (mapSize));
      const z = [
        Math.sin((x+y+this.lastTimeUpdated/300)/2)/2,
        Math.sin((x-y+this.lastTimeUpdated/300)/2)/2,
        -6
      ].reduce((a, b) => a + b, 0);//this.engine.random() * 2 - 8;
      target.set(x, z, y);
    };
    return new ParametricGeometry(calculatePoint, mapSize, mapSize);
  }

  private updateSurface(deltaTime: number) {
    this.lastTimeUpdated += deltaTime;
    const tmpGeometry = this.createWaterGeometry();
    this.waterGeometry.copy(tmpGeometry);
  }
}
