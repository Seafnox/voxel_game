import { ModelState } from 'src/system/ModelSystem';
import { AnimationMixer } from 'three';
import { ModelController, ModelConfig } from 'src/entity/models/ModelController';

export interface GltfModelConfig extends ModelConfig {
}

export class GltfModelController extends ModelController<GltfModelConfig> {
  loadModels(config: GltfModelConfig) {
    this.mixer?.stopAllAction();
    const modelName = config.resourcePath.split('/').reverse()[0];
    this.modelSystem.register(modelName, config.resourcePath);
    this.modelSystem.get(modelName).then((modelState: ModelState | Error) => {
      if (modelState instanceof Error) return;
      const model = modelState.model.clone(true);
      this.animationMap = {};
      this.mixer = new AnimationMixer(model);
      modelState.animations.forEach(animationClip => this.addAnimation(animationClip.clone()));
      this.onTargetLoaded(model, config);
    });
  }
}
