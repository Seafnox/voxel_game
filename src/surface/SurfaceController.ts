import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { SceneProperty } from 'src/render/SceneProperty';
import { SurfaceHelperSystem } from 'src/surface/SurfaceHelperSystem';
import { Mesh, Vector3, BackSide, Texture, DataTexture, MeshStandardMaterial, MeshBasicMaterial } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';

export class SurfaceController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.sceneProperty.add(this.createSurfaceWireframeMesh());
    this.sceneProperty.add(this.createSurfaceMesh());
  }

  private get surfaceHelper(): SurfaceHelperSystem {
    return this.engine.systems.find(SurfaceHelperSystem);
  }

  private get sceneProperty(): SceneProperty {
    return this.engine.properties.find(SceneProperty);
  }

  // TODO FEATURE add target position check and entity subscription
  private createSurfaceMesh(): Mesh {
    const geometry = this.createSurfaceGeometry();
    const texture = this.createSurfaceTexture();
    const material = new MeshStandardMaterial({
      map: texture,
      side: BackSide,
    });
    const surfaceMesh = new Mesh(geometry, material);

    surfaceMesh.castShadow = false;
    surfaceMesh.receiveShadow = true;

    return surfaceMesh;
  }

  private createSurfaceWireframeMesh(): Mesh {
    const geometry = this.createSurfaceGeometry();
    const material = new MeshBasicMaterial({
      color: 0x666666,
      wireframe: true,
      wireframeLinewidth: 4,
    });
    const surfaceMesh = new Mesh(geometry, material);

    surfaceMesh.castShadow = false;
    surfaceMesh.receiveShadow = true;

    return surfaceMesh;
  }

  private createSurfaceGeometry(): ParametricGeometry {
    const mapSize = this.surfaceHelper.mapSize;
    const calculatePoint = (percentX: number, percentY: number, target: Vector3) => {
      const x = this.surfaceHelper.getMapToCord(percentX * (mapSize));
      const y = this.surfaceHelper.getMapToCord(percentY * (mapSize));
      const z = this.surfaceHelper.getZCord(x,y);
      target.set(x, z, y);
    };
    return new ParametricGeometry(calculatePoint, mapSize, mapSize);
  }

  // TODO make more smooth texture
  private createSurfaceTexture(): Texture {
    const mapSize = this.surfaceHelper.mapSize;
    const scale = 16;
    const colorScale = 4;
    const imageSize = mapSize * mapSize;
    const data = new Uint8Array( colorScale * imageSize * scale * scale );

    for ( let x = 0; x < mapSize; x += 1/scale ) {
      for ( let y = 0; y < mapSize; y += 1/scale ) {
        const stride = (y * mapSize * scale + x) * colorScale * scale;
        const color = this.surfaceHelper.getSurfacePointColor(x,y);
        data[ stride ] = (((color & 0xFF0000) >> 16) * (0.9 + this.engine.random()* 0.1)) % 0xFF;
        data[ stride + 1 ] = (((color & 0x00FF00) >> 8) * (0.9 + this.engine.random()* 0.1)) % 0xFF;
        data[ stride + 2 ] = ((color & 0x0000FF) * (0.9 + this.engine.random()* 0.1)) % 0xFF;
        data[ stride + 3 ] = 0xFF;
      }
    }

    // used the buffer to create a DataTexture
    const texture = new DataTexture( data, mapSize * scale, mapSize * scale);
    texture.needsUpdate = true;

    return texture;
  }
}
