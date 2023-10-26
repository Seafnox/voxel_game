import {
  Vector3,
  Scene,
  Color,
  AnimationClip,
  TextureLoader,
  sRGBEncoding,
  Texture,
  Material,
  AnimationMixer,
  Object3D,
  Mesh,
  LoadingManager,
  AnimationAction
} from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {MeshPhongMaterial} from 'three/src/materials/MeshPhongMaterial';
import {EmittedEvent} from '../commons/EmittedEvent';
import {ModelComponent} from "./ModelComponent";

export interface GltfModelConfig {
  resourcePath: string;
  resourceModel: string;
  scene: Scene;
  scale: number;
  resourceTexture?: string;
  specular?: Color;
  emissive?: Color;
  receiveShadow?: boolean;
  castShadow?: boolean;
  visible?: boolean;
}

interface ModelConfig {
  animation: AnimationAction;
  animations: Record<string, AnimationAction>;
}

export class GltfModelComponent extends ModelComponent {
  private animationMap: Record<string, ModelConfig> = {};
  private activeAnimationName: string | undefined;
  private activeAnimation: ModelConfig | undefined;
  private boundOnPositionChange = this.onPositionChange.bind(this);
  private mixer: AnimationMixer | undefined;
  private texture: Texture | undefined;

  constructor(
    private params: GltfModelConfig,
  ) {
    super();
    this.loadResources();
  }

  onEntityChange() {
    if (!this.entity) {
      console.log(this);
      throw new Error(`Can't find entity in ${this.constructor.name}`);
    }

    this.entity.on('update.position', this.boundOnPositionChange);
  }

  onPositionChange(m: EmittedEvent<Vector3>) {
    if (this.model) {
      this.model.position.copy(m.value);
      this.model.position.y = 0.35;
    }
  }

  private onModelLoaded(model: Object3D) {
    if (!this.entity) {
      throw new Error(`Can't find parent entity`);
    }

    this.mixer?.stopAllAction();

    this.model = model;
    this.params.scene.add(this.model);

    this.model.scale.setScalar(this.params.scale);
    this.model.position.copy(this.entity.getPosition());

    // FIXME possible it is no necessary
    this.entity.setPosition(this.entity.getPosition());

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.model.traverse((c: Mesh) => {
      const materials: Material[] = c.material instanceof Array ? c.material : [c.material];

      // FIXME fake type declaration
      for (const m of (materials as MeshPhongMaterial[])) {
        if (m) {
          if (this.texture) {
            m.map = this.texture;
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

    this.mixer = new AnimationMixer(this.model);

    this.entity.setModel(this.model);
  }

  setActiveAnimation(animationName: string, trusted = false) {
    if (!trusted) {
      const animations = this.animationMap;

      if (!animations[animationName]) {
        console.warn(`Can't find animation '${animationName}' in list [${Object.keys(animations).join(', ')}]`);
        return;
      }
    }

    console.log('setActiveAnimation', animationName, Object.keys(this.animationMap || {}));

    this.mixer!.stopAllAction();

    this.activeAnimationName = animationName;
    this.activeAnimation = this.animationMap[animationName];
    const action = this.activeAnimation.animation;
    action.play();
  }

  loadResources() {
    if (this.params.resourceTexture) {
      const textureLoader = new TextureLoader();
      this.texture = textureLoader.load(this.params.resourceTexture);
      this.texture.encoding = sRGBEncoding;
    }

    const path = this.params.resourcePath;
    const model = this.params.resourceModel;
    if (!model.endsWith('glb') && !model.endsWith('gltf')) {
      throw new Error(`Can't find loader for such type of file: ${model}`)
    }
    const manager = new LoadingManager();
    const loader = new GLTFLoader(manager);
    loader.setPath(path);
    loader.load(model, (glb) => {
      this.onModelLoaded(glb.scene);
      this.onAnimationLoaded('all', glb.animations);
    });
  }

  onAnimationLoaded(key: string, animationList: AnimationClip[]) {
    if (!this.entity) {
      throw new Error(`Can't find parent entity`);
    }

    if (this.animationMap[key]) {
      console.warn(`Animation with name '${key}' already exsist!`);
      return;
    }

    const animations = animationList.reduce<Record<string, AnimationAction>>((result, animation) => {
      console.log('Found animation', key, animation.name);
      result[animation.name] = this.mixer!.clipAction(animation);

      return result;
    }, {});

    this.animationMap[key] = { animations, animation: this.mixer!.clipAction(animationList[0]) };
  }

  update(timeElapsed: number) {
    if (this.mixer) {
      this.mixer.update(timeElapsed);
    }
  }
}
