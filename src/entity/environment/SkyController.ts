import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { VisualEntity } from 'src/entity/VisualEntity';
import { SceneFactor } from 'src/factor/SceneFactor';
import skyFragment from 'src/resources/sky.fs';
import skyVertex from 'src/resources/sky.vs';
import { HemisphereLight, Mesh, SphereGeometry, ShaderMaterial, BackSide, Color } from 'three';

export class SkyController extends Controller<VisualEntity> {
    private backgroundColor = 0xffffcc;
    private skyColor = 0x15c5FF;
    private target: VisualEntity | undefined;
    private skySpere: Mesh;
    private skySphereLight: HemisphereLight;

    constructor(
        engine: GameEngine,
        entity: Entity,
        name: string,
    ) {
        if (!(entity instanceof VisualEntity)) {
            throw new Error(`Can't make calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
        }

        super(engine, entity, name);

        this.skySpere = this.createSkySpere();
        this.skySphereLight = this.createSkySphereLight();

        this.sceneFactor.add(this.skySpere, this.skySphereLight);
    }

    get sceneFactor(): SceneFactor {
        return this.engine.factors.findOne(SceneFactor);
    }

    setTarget(targetEntity: VisualEntity) {
        this.target = targetEntity;
    }

    update() {
        if (!this.target) return;

        this.skySpere.position.x = this.target.getPosition().x;
        this.skySpere.position.z = this.target.getPosition().z;
    }

    private createSkySphereLight(): HemisphereLight {
        return new HemisphereLight(this.skyColor, this.backgroundColor, 0.6);
    }

    private createSkySpere(): Mesh {
        const skyGeo = new SphereGeometry(2000, 32, 32);
        const skyMat = new ShaderMaterial({
            uniforms: {
                topColor: {value: new Color(this.skyColor)},
                bottomColor: {value: new Color(this.backgroundColor)},
                offset: {value: 33},
                exponent: {value: 0.6},
            },
            vertexShader: skyVertex,
            fragmentShader: skyFragment,
            side: BackSide,
        });

        return new Mesh(skyGeo, skyMat);
    }
}
