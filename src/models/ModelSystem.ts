import { EventSystem } from 'src/engine/EventSystem';
import { LoadingManager, AnimationClip, Object3D } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { ConfigurableModelLoader, ConfigurableModel } from './configurable/ConfigurableModelLoader';

export const enum ModelEvent {
  Progress = 'Progress',
}

export const enum ModelProgressState {
  Pending,
  Done,
  Error,
}

export interface ModelState {
  model: Object3D;
  animations: AnimationClip[];
}

interface LoaderConfig {
   onReady: (state: ModelState) => void;
   onProgress: (progress: ProgressEvent) => void;
   onError: (error: unknown) => void;
   manager?: LoadingManager;
}

export class ModelSystem extends EventSystem {
  private modelStates: Record<string, ModelState | Error> = {};
  private modelInProgress: Record<string, ModelProgressState> = {};

  register(modelName: string, resourceLink: string, manager?: LoadingManager) {
    if (modelName in this.modelInProgress) return;
    if (modelName in this.modelStates) return;

    this.modelInProgress[modelName] = ModelProgressState.Pending;
    this.load(
      resourceLink,
      {
        onReady: modelState => {
          this.modelStates[modelName] = modelState;
          this.modelInProgress[modelName] = ModelProgressState.Done;
          this.emit(modelName, this.modelStates[modelName]);
        },
        onProgress: progress => this.emit<ProgressEvent>(ModelEvent.Progress, progress),
        onError: error => {
          console.error(error);
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          this.modelStates[modelName] = new Error(`Failed to load model '${modelName}' from file '${resourceLink}'. Reason: ${error}`)
          this.modelInProgress[modelName] = ModelProgressState.Error;
          this.emit(modelName, this.modelStates[modelName]);
        },
        manager,
      }
    );
  }

  get(modelName: string): Promise<ModelState | Error> {
    if (modelName in this.modelStates) {
      if (this.modelStates[modelName] instanceof Error) return Promise.reject(this.modelStates[modelName]);

      return Promise.resolve(this.modelStates[modelName]);
    }

    if (modelName in this.modelInProgress) {
      return new Promise((resolve, reject) => {
        this.on(modelName, (model: ModelState | Error) => {
          if (model instanceof Error) return reject(model);

          resolve(model);
        })
      });
    }

    return Promise.reject(
      new Error(`Can't find registered model: '${modelName}' in list [${Object.keys(this.modelStates).join(', ')}] and list [${Object.keys(this.modelInProgress).join(', ')}]`)
    );
  }

  private load(resourceLink: string, config: LoaderConfig): void {
    if (resourceLink.endsWith('fbx')) {
      const loader = new FBXLoader(config.manager);
      loader.load(
        resourceLink,
        (fbxModel: Object3D) => {
          config.onReady({
            model: fbxModel,
            animations: fbxModel.animations,
          })
        },
        config.onProgress,
        config.onError
      );

      return;
    }

    if (resourceLink.endsWith('glb') || resourceLink.endsWith('gltf')) {
      const loader = new GLTFLoader(config.manager);
      loader.load(
        resourceLink,
        (gltf: GLTF) => {
          config.onReady({
            model: gltf.scene,
            animations: gltf.animations,
          })
        },
        config.onProgress,
        config.onError,
      );

      return;
    }

    if (resourceLink.endsWith('json')) {
      const loader = new ConfigurableModelLoader(config.manager);
      loader.load(
        resourceLink,
        (data: ConfigurableModel) => {
          config.onReady(data);
        },
        config.onProgress,
        config.onError,
      );

      return;
    }

    throw new Error(`Can't find loader for such type of file: ${resourceLink}`);
  }
}
