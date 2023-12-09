import { ModelState } from 'src/models/ModelSystem';
import { ModelController, ModelConfig } from 'src/models/ModelController';
import { clone } from 'src/render/SkeletonUtils';

export interface GltfModelConfig extends ModelConfig {
}

export class GltfModelController extends ModelController<GltfModelConfig> {
  loadModels(config: GltfModelConfig) {
    this.mixer?.stopAllAction();
    const modelName = config.resourcePath.split('/').reverse()[0];
    this.modelSystem.register(modelName, config.resourcePath);
    this.modelSystem.get(modelName)
      .then((modelState: ModelState | Error) => {
        if (modelState instanceof Error) return;
        const model = clone(modelState.model);
        const animations = modelState.animations.map(animation => animation.clone());
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`Model loaded: ${modelName} - ${model.id} (${model.position.toArray()} | ${model.quaternion.toArray()})`);
        this.onTargetLoaded(model, animations, config);
      })
      .catch(error => console.error(error));
  }
}
