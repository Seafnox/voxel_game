import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { PositionProperty } from 'src/entity/properties/visual';
import { SceneFactor } from 'src/factor/SceneFactor';
import skyFragment from 'src/resources/sky.fs';
import skyVertex from 'src/resources/sky.vs';
import { HemisphereLight, Mesh, SphereGeometry, ShaderMaterial, BackSide, Color, Vector3 } from 'three';

export class SkyController extends Controller {
    private backgroundColor = 0xffffcc;
    private skyColor = 0x15c5FF;
    private target: Entity | undefined;
    private skySpere: Mesh;
    private skySphereLight: HemisphereLight;

    constructor(
        engine: GameEngine,
        entity: Entity,
        name: string,
    ) {
        super(engine, entity, name);

        this.skySpere = this.createSkySpere();
        this.skySphereLight = this.createSkySphereLight();

        this.sceneFactor.add(this.skySpere, this.skySphereLight);
    }

    get sceneFactor(): SceneFactor {
        return this.engine.factors.find(SceneFactor);
    }

    setTarget(targetEntity: Entity) {
        this.target = targetEntity;
    }

    update() {
        if (!this.target) return;

        const targetPosition = this.target.getProperty<Vector3>(PositionProperty);

        this.skySpere.position.x = targetPosition.x;
        this.skySpere.position.z = targetPosition.z;
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
