import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { CameraProperty } from 'src/camera/CameraProperty';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { SceneProperty } from 'src/render/SceneProperty';
import { FontSystem } from 'src/text/FontSystem';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { VMath } from 'src/VMath';
import { Vector3, Mesh, MeshLambertMaterial } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { Font } from 'three/examples/jsm/loaders/FontLoader';
import { Camera } from 'three/src/cameras/Camera';

export class NameController extends Controller {
  private mesh = new Mesh<TextGeometry, MeshLambertMaterial>();
  private fontName = 'droid_sans_mono_regular';
  private sizeOffset = new Vector3(0, 1, 0);
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    //this.entity.on(PositionProperty, this.updatePosition.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.updatePosition.bind(this));
    this.loadFont();
  }

  private get entityPosition(): Vector3 {
    return this.entity.properties.find(PositionProperty).get().clone();
  }

  private get sceneProperty(): SceneProperty {
    return this.engine.properties.find(SceneProperty);
  }

  private get camera(): Camera {
    return this.engine.properties.find(CameraProperty).get();
  }

  private get fontSystem(): FontSystem {
    return this.engine.systems.find(FontSystem);
  }

  private loadFont() {
    this.fontSystem.register(this.fontName, 'resources/fonts/droid_sans_mono_regular.typeface.json');
    this.fontSystem.on<Font>(this.fontName, font => this.drawText(font));
  }

  private drawText(font: Font) {
    const material = new MeshLambertMaterial( { color: 0xff9999, transparent: true } );
    const geometry = new TextGeometry( this.entityName, {
      font: font,
      size: 1,
      height: 0.1,
      curveSegments: 8,
      bevelEnabled: false,
    });
    geometry.computeBoundingBox();
    this.sizeOffset.x = - (geometry.boundingBox?.max?.x || 0)/2;

    this.mesh = new Mesh(geometry, material);
    this.updatePosition();

    this.sceneProperty.add(this.mesh);
  }

  private updatePosition() {
    //const position = new Vector3(0,10, 10);
    //const rotationFactor = new Quaternion(0,1,0,1).multiply(this.camera.quaternion);
    //const primitive = new Vector3(0,0,1);
    const distance = this.entityPosition.distanceTo(this.camera.position);
    const meshPosition = new Vector3(0,distance/3, 5);
    const opacity  = distance < 10
      ? 1
      : distance > 60
        ? 0
        : 1 - VMath.revertLerp(distance, 10, 60);

    meshPosition.add(this.sizeOffset);
    meshPosition.applyQuaternion(this.camera.quaternion.clone());
    meshPosition.add(this.entityPosition);

    if (this.mesh.material.opacity != opacity) {
      this.mesh.material.setValues({opacity});
      this.mesh.material.needsUpdate = true;
    }

    if (this.mesh.position.distanceTo(meshPosition) >= VMath.epsilon) {
      this.mesh.position.copy(meshPosition);
    }

    this.mesh.quaternion.copy(this.camera.quaternion);
  }
}
