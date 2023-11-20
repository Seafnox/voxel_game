import { AnimationClip, LoadingManager, AnimationMixer } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { ModelController, ModelConfig } from 'src/entity/models/ModelController';

export interface FbxModelConfig extends ModelConfig {
  resourceAnimations?: Record<string, string>;
}

export class FbxModelController extends ModelController<FbxModelConfig> {
  loadModels(config: FbxModelConfig) {
    const model = config.resourceModel;

    if (!model.endsWith('fbx')) {
      throw new Error(`Can't find loader for such type of file: ${model}`);
    }

    this.mixer?.stopAllAction();
    const manager = new LoadingManager();
    const loader = new FBXLoader(manager);
    loader.setPath(config.resourcePath);
    loader.load( model, (fbxModel) => {
      this.animationMap = {};
      this.mixer = new AnimationMixer(fbxModel);
      Object.entries(config.resourceAnimations || {}).forEach(([key, fileName]) => {
        loader.load(fileName, (fbx) => this.onAnimationLoaded(key, fbx.animations[0]));
      });
      manager.onLoad = () => this.onTargetLoaded(fbxModel, config);
    });
  }

  onAnimationLoaded(key: string, animationClip: AnimationClip) {
    console.log('Found animation', key, animationClip.name);
    this.animationMap[animationClip.name] = this.mixer!.clipAction(animationClip);
  }
}
