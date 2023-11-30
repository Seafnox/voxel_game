import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { PositionProperty } from 'src/entity/properties/visual';
import { FontFactor } from 'src/factor/FontFactor';
import { SceneFactor } from 'src/factor/SceneFactor';
import { Vector3, Mesh } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { MeshPhongMaterial } from 'three/src/materials/MeshPhongMaterial';

export class NameController extends Controller {
  private mesh: Mesh = new Mesh();
  private fontName = 'droid_sans_mono_regular';
  private positionOffset = new Vector3(0, 10, 10);
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.on(PositionProperty, this.updatePosition.bind(this));
    this.loadFont();
  }

  private get entityPosition(): Vector3 {
    return this.entity.getProperty<Vector3>(PositionProperty).clone();
  }

  private get sceneFactor(): SceneFactor {
    return this.engine.factors.find(SceneFactor);
  }

  private get fontFactor(): FontFactor {
    return this.engine.factors.find(FontFactor);
  }

  private loadFont() {
    this.fontFactor.registerFont(this.fontName, 'resources/fonts/droid_sans_mono_regular.typeface.json');
    this.fontFactor.on<Font>(this.fontName, font => {
      this.drawText(font);
    });
  }

  private drawText(font: Font) {
    const material = new MeshPhongMaterial( { color: 0xff9999, flatShading: true } );
    const geometry = new TextGeometry( this.entityName, {
      font: font,
      size: 1,
      height: 0.1,
      curveSegments: 8,
      bevelEnabled: false,
    });
    geometry.computeBoundingBox();
    this.positionOffset.x = - (geometry.boundingBox?.max?.x || 0)/2;

    this.mesh = new Mesh(geometry, material);
    this.updatePosition();

    this.sceneFactor.add(this.mesh);
  }

  private updatePosition() {
    this.mesh.position.copy(this.entityPosition);
    this.mesh.position.add(this.positionOffset);
  }
}
