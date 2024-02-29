import { Group } from 'three';
import { ModelController, ModelConfig } from '../ModelController';
import { BaseModelUnitConfig } from './BaseModelUnitConfig';
import { ModelUnit } from './ModelUnit';

export interface ConfigurableModelConfig extends ModelConfig {
  modelConfig: Record<string, BaseModelUnitConfig>;
  animations: Record<string, Record<string, BaseModelUnitConfig>>
}

export class ConfigurableModelController extends ModelController<ConfigurableModelConfig> {
  protected loadModels(config: ConfigurableModelConfig) {
    const modelGroup = new Group();
    Object.keys(config.modelConfig).forEach((key) => {
      const modelUnitConfig = config.modelConfig[key];
      const modelUnit = ModelUnit.build(modelUnitConfig);
      modelUnit.name = key;
      modelUnit.visible = config.visible ?? true;
      modelGroup.add(modelUnit);
    });

    this.onTargetLoaded(modelGroup, animationClips, config);
  }
}
