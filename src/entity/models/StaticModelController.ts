import {Scene, Group, Vector3, sRGBEncoding, TextureLoader, Texture, Material, Mesh, Color} from 'three';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial';
import {EmittedEvent} from '../commons/emitter/EmittedEvent';
import {ModelController} from "./ModelController";

export interface StaticModelConfig {
  resourcePath: string;
  resourceName: string;
  scene: Scene;
  scale: number;
  resourceTexture?: string;
  specular?: Color;
  emissive?: Color;
  receiveShadow?: boolean;
  castShadow?: boolean;
  visible?: boolean;
}

export class StaticModelController extends ModelController {
  private boundOnPositionChange = this.onPositionChange.bind(this);

  constructor(
    private params: StaticModelConfig,
  ) {
    super();
    this.loadModels();
  }

  onEntityChange() {
    if (!this.entity) {
      console.log(this);
      throw new Error(`Can't find entity in ${this.constructor.name}`);
    }

    this.entity.on<Vector3>('update.position', this.boundOnPositionChange);
  }

  onPositionChange(m: EmittedEvent<Vector3>) {
    if (this.model) {
      this.model.position.copy(m.value);
    }
  }

  loadModels() {
    if (this.params.resourceName.endsWith('glb') || this.params.resourceName.endsWith('gltf')) {
      this.loadAsGLTF();
    } else if (this.params.resourceName.endsWith('fbx')) {
      this.loadAsFBX();
    }
  }

  onTargetLoaded(obj: Group) {
    if (!this.entity) {
      throw new Error(`Can't find parent entity`);
    }

    this.model = obj;
    this.params.scene.add(this.model);

    this.model.scale.setScalar(this.params.scale);
    this.entity && this.model.position.copy(this.entity.getPosition());

    let texture: Texture | null = null;
    if (this.params.resourceTexture) {
      const texLoader = new TextureLoader();
      texture = texLoader.load(this.params.resourceTexture);
      texture.encoding = sRGBEncoding;
    }

    // FIXME fake type declaration
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    this.model.traverse((c: Mesh) => {
      const materials: Material[] = c.material instanceof Array ? c.material : [c.material];

      // FIXME fake type declaration
      for (const m of (materials as MeshPhongMaterial[])) {
        if (m) {
          if (texture) {
            m.map = texture;
          }
          if (this.params.specular) {
            m.specular = this.params.specular;
          }
          if (this.params.emissive) {
            m.emissive = this.params.emissive;
          }
        }
      }
      if (this.params.receiveShadow != undefined) {
        c.receiveShadow = this.params.receiveShadow;
      }
      if (this.params.castShadow != undefined) {
        c.castShadow = this.params.castShadow;
      }
      if (this.params.visible != undefined) {
        c.visible = this.params.visible;
      }
    });

    this.entity.isModelReady = true;
  }

  loadAsGLTF() {
    const loader = new GLTFLoader();
    loader.setPath(this.params.resourcePath);
    loader.load(this.params.resourceName, (glb) => {
      this.onTargetLoaded(glb.scene);
    });
  }

  loadAsFBX() {
    const loader = new FBXLoader();
    loader.setPath(this.params.resourcePath);
    loader.load(this.params.resourceName, (fbx) => {
      this.onTargetLoaded(fbx);
    });
  }

  public update(): void {}
}
