import { ModelState } from 'src/models/ModelSystem';
import { clone } from 'src/render/SkeletonUtils';
import { LoadingManager } from 'three';
import { ModelController, ModelConfig } from 'src/models/ModelController';

export interface FbxModelConfig extends ModelConfig {
  resourceAnimationModels?: Record<string, string>;
}

export class FbxModelController extends ModelController<FbxModelConfig> {
  loadModels(config: FbxModelConfig) {
    this.mixer?.stopAllAction();

    const manager = new LoadingManager();
    const modelName = config.resourcePath.split('/').reverse()[0];

    this.modelSystem.register(modelName, config.resourcePath, manager);
    this.modelSystem.get(modelName)
      .then((modelState: ModelState | Error) => {
        if (modelState instanceof Error) return;
        // FIXME refactor animation loading
//      Object.entries(config.resourceAnimations || {}).forEach(([key, fileName]) => {
//        loader.load(fileName, (fbx) => this.onAnimationLoaded(key, fbx.animations[0]));
//      });
        const model = clone(modelState.model);
        const animations = modelState.animations.map(animation => animation.clone());
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`Model loaded: ${modelName} - ${model.id} (${model.position.toArray()} | ${model.quaternion.toArray()})`);
        this.onTargetLoaded(model, animations, config);
      })
      .catch(error => console.error(error));
  }
}
