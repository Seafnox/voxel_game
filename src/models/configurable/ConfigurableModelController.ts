import { LoadingManager } from 'three';
import { ModelController, ModelConfig } from '../ModelController';
import { ModelState } from '../ModelSystem';

export class ConfigurableModelController extends ModelController<ModelConfig> {
  protected loadModels(config: ModelConfig) {
    this.mixer?.stopAllAction();

    const manager = new LoadingManager();
    const modelName = config.resourcePath.split('/').reverse()[0];

    this.modelSystem.register(modelName, config.resourcePath, manager);
    this.modelSystem.get(modelName)
      .then((modelState: ModelState | Error) => {
        if (modelState instanceof Error) {
          throw modelState;
        }

        this.onTargetLoaded(modelState.model, modelState.animations, config);
      })
      .catch(error => console.error(error));

  }
}
