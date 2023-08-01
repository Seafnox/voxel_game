import { Vector3, Scene, Color, AnimationClip, TextureLoader, sRGBEncoding, Texture, Material, AnimationMixer, Object3D, Mesh } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';
import { Component } from '../Component';
import { EmittedEvent } from '../EmittedEvent';
import { Entity } from '../Entity';

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
    _target: Object3D | undefined;
    private _mixer?: AnimationMixer;

    constructor(
        private params: AnimatedModelConfig,
    ) {
        this.loadModels();
    }

    initComponent() {
        this.entity?.on('update.position', this.boundOnPositionChange);
    }

    onPositionChange(m: EmittedEvent<Vector3>) {
        if (this._target) {
            this._target.position.copy(m.value);
            this._target.position.y = 0.35;
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
        this._target = obj;
        this.params.scene.add(this._target);

        this._target.scale.setScalar(this.params.scale);
        this._target.position.copy(this.entity.getPosition());

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
        this._target.traverse((c: Mesh) => {
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
                this._mixer = new AnimationMixer(obj);
                const clip = animations[0];
                const action = this._mixer.clipAction(clip);

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
        if (this._mixer) {
            this._mixer.update(timeElapsed);
        }
    }
}
