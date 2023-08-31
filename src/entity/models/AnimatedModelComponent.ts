import { Vector3, Scene, Color, AnimationClip, TextureLoader, sRGBEncoding, Texture, Material, AnimationMixer, Object3D, Mesh } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { Component } from '../commons/Component';
import { EmittedEvent } from '../commons/EmittedEvent';
import { Entity } from '../commons/Entity';

export interface AnimatedModelConfig {
    resourcePath: string;
    resourceName: string;
    resourceAnimation: string;
    scene: Scene;
    scale: number;
    resourceTexture?: string;
    specular?: Color;
    emissive?: Color;
    receiveShadow?: boolean;
    castShadow?: boolean;
    visible?: boolean;
}

export class AnimatedModelComponent implements Component {
    private boundOnPositionChange = this.onPositionChange.bind(this);
    entity: Entity | undefined;
    target: Object3D | undefined;
    private mixer?: AnimationMixer;

    constructor(
        private params: AnimatedModelConfig,
    ) {
        this.loadModels();
    }

    onEntityChange() {
      if (!this.entity) {
        console.log(this);
        throw new Error(`Can't find entity in ${this.constructor.name}`);
      }

      this.entity.on('update.position', this.boundOnPositionChange);
    }

    onPositionChange(m: EmittedEvent<Vector3>) {
        if (this.target) {
            this.target.position.copy(m.value);
            this.target.position.y = 0.35;
        }
    }

    loadModels() {
        if (this.params.resourceName.endsWith('glb') || this.params.resourceName.endsWith('gltf')) {
            this.loadAsGLTF();
        } else if (this.params.resourceName.endsWith('fbx')) {
            this.loadAsFBX();
        }
    }

    onTargetLoaded(obj: Object3D, animations: AnimationClip[]) {
        if (!this.entity) {
            throw new Error(`Can't find parent entity`);
        }
        this.target = obj;
        this.params.scene.add(this.target);

        this.target.scale.setScalar(this.params.scale);
        this.target.position.copy(this.entity.getPosition());

        this.entity.setPosition(this.entity.getPosition());

        let texture: Texture | undefined;
        if (this.params.resourceTexture) {
            const texLoader = new TextureLoader();
            texture = texLoader.load(this.params.resourceTexture);
            texture.encoding = sRGBEncoding;
        }

        // FIXME fake type declaration
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this.target.traverse((c: Mesh) => {
            const materials: Material[] = c.material instanceof Array ? c.material : [c.material];

            // FIXME fake type declaration
            for (const m of (materials as MeshPhongMaterial[])) {
                if (m) {
                    if (texture) {
                        m.map = texture;
                    }
                    if (this.params.specular) {
                        m.specular = this.params.specular;
                    }
                    if (this.params.emissive) {
                        m.emissive = this.params.emissive;
                    }
                }
            }

            if (this.params.receiveShadow != undefined) {
                c.receiveShadow = this.params.receiveShadow;
            }
            if (this.params.castShadow != undefined) {
                c.castShadow = this.params.castShadow;
            }
            if (this.params.visible != undefined) {
                c.visible = this.params.visible;
            }
        });

        if (Array.isArray(animations) && animations.length > 0) {
            setTimeout(() => {
                this.mixer = new AnimationMixer(obj);
                const clip = animations[0];
                const action = this.mixer.clipAction(clip);

                action.play();
            });
        }

        this.entity.setModel(obj);
    }

    loadAsGLTF() {
        const loader = new GLTFLoader();
        loader.setPath(this.params.resourcePath);
        loader.load(this.params.resourceName, (glb) => {
            this.onTargetLoaded(glb.scene, []);
        });
    }

    loadAsFBX() {
        const loader = new FBXLoader();
        loader.setPath(this.params.resourcePath);
        loader.load(this.params.resourceName, (fbx) => {
            loader.load(this.params.resourceAnimation, (a) => {
                this.onTargetLoaded(fbx, a.animations);
            });
        });
    }

    update(timeElapsed: number) {
        if (this.mixer) {
            this.mixer.update(timeElapsed);
        }
    }
}
