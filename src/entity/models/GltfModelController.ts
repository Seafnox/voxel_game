import { AnimationMixer, LoadingManager } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ModelController, ModelConfig } from 'src/entity/models/ModelController';

export interface GltfModelConfig extends ModelConfig {
}

export class GltfModelController extends ModelController<GltfModelConfig> {
  loadModels(config: GltfModelConfig) {
    const model = config.resourceModel;

    if (!model.endsWith('glb') && !model.endsWith('gltf')) {
      throw new Error(`Can't find loader for such type of file: ${model}`);
    }

    this.mixer?.stopAllAction();

    const loader = new GLTFLoader();
    loader.setPath(config.resourcePath);
    loader.load(model, (glb) => {

      this.animationMap = {};
      this.mixer = new AnimationMixer(glb.scene);
      glb.animations.forEach(animationClip => this.addAnimation(animationClip));
      this.onTargetLoaded(glb.scene, config);
    });
  }
}
