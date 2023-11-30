import { ModelState } from 'src/system/ModelSystem';
import { LoadingManager, AnimationMixer } from 'three';
import { ModelController, ModelConfig } from 'src/entity/models/ModelController';

export interface FbxModelConfig extends ModelConfig {
  resourceAnimationModels?: Record<string, string>;
}

export class FbxModelController extends ModelController<FbxModelConfig> {
  loadModels(config: FbxModelConfig) {
    this.mixer?.stopAllAction();

    const manager = new LoadingManager();
    const modelName = config.resourcePath.split('/').reverse()[0];

    this.modelSystem.register(modelName, config.resourcePath, manager);
    this.modelSystem.get(modelName).then((modelState: ModelState | Error) => {
      if (modelState instanceof Error) return;
      const model = modelState.model.clone(true);
      this.animationMap = {};
      this.mixer = new AnimationMixer(model);
      // FIXME refactor animation loading
//      Object.entries(config.resourceAnimations || {}).forEach(([key, fileName]) => {
//        loader.load(fileName, (fbx) => this.onAnimationLoaded(key, fbx.animations[0]));
//      });
      modelState.animations.forEach(animationClip => this.addAnimation(animationClip.clone()));
      this.onTargetLoaded(model, config);
    });
  }
}
