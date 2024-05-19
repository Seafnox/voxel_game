import { clone } from '../../render/SkeletonUtils';
import { ModelController, ModelConfig } from '../ModelController';
import { ModelState } from '../ModelSystem';

export class ConfigurableModelController extends ModelController {
  protected loadModels(config: ModelConfig) {
    this.mixer?.stopAllAction();

    const modelName = config.resourcePath.split('/').reverse()[0];

    this.modelSystem.register(modelName, config.resourcePath);
    this.modelSystem.get(modelName)
      .then((modelState: ModelState | Error) => {
        if (modelState instanceof Error) {
          throw modelState;
        }

        const model = clone(modelState.model);
        const animations = modelState.animations.map(animation => animation.clone());
        this.onTargetLoaded(model, animations, config);
      })
      .catch(error => console.error(error));
  }
}
