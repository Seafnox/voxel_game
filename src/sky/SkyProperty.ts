import { GameEngine } from 'src/engine/GameEngine';
import { GlobalProperty } from 'src/engine/GlobalProperty';
import skyFragment from 'src/resources/sky.fs';
import skyVertex from 'src/resources/sky.vs';
import { HemisphereLight, Mesh, SphereGeometry, ShaderMaterial, Color, BackSide } from 'three';

export interface Sky {
  helios: Mesh<SphereGeometry, ShaderMaterial>;
  light: HemisphereLight;
}

const backgroundColor = 0xffffcc;
const skyColor = 0x15c5FF;
const skyGeo = new SphereGeometry(2000, 32, 32);
const skyMat = new ShaderMaterial({
  uniforms: {
    topColor: {value: new Color(skyColor)},
    bottomColor: {value: new Color(backgroundColor)},
    offset: {value: 33},
    exponent: {value: 0.6},
  },
  vertexShader: skyVertex,
  fragmentShader: skyFragment,
  side: BackSide,
});

export class SkyProperty extends GlobalProperty<Sky> {
  constructor(
    engine: GameEngine,
    value: Sky = {
      helios: new Mesh(skyGeo, skyMat),
      light: new HemisphereLight(skyColor, backgroundColor, 0.6),
    },
  ) {
    super(engine, value);


  }

  get skySphere(): Mesh {
    return this.get().helios;
  }

  get skySphereLight(): HemisphereLight {
    return this.get().light;
  }
}
