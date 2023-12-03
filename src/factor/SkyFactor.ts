import skyFragment from 'src/resources/sky.fs';
import skyVertex from 'src/resources/sky.vs';
import { HemisphereLight, Mesh, SphereGeometry, ShaderMaterial, Color, BackSide } from 'three';

export class SkyFactor {
  private backgroundColor = 0xffffcc;
  private skyColor = 0x15c5FF;
  private _skySpere = this.createSkySphere();
  private _skySphereLight = this.createSkySphereLight();

  get skySphere(): Mesh {
    return this._skySpere;
  }

  get skySphereLight(): HemisphereLight {
    return this._skySphereLight;
  }

  private createSkySphereLight(): HemisphereLight {
    return new HemisphereLight(this.skyColor, this.backgroundColor, 0.6);
  }

  private createSkySphere(): Mesh {
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
