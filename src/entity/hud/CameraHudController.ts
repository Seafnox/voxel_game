import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { CameraPositionProperty, CameraRotationProperty } from 'src/entity/properties/camera';
import { TickSystem, TickSystemEvent } from 'src/system/TickSystem';
import { Vector3, Quaternion } from 'three';
import { getHtmlElementByIdOrThrow } from 'src/utils/getHtmlElementOrThrow';
import {Controller} from 'src/engine/Controller';
import {EntityName} from 'src/engine/EntityName';
import {HtmlElementId} from 'src/HtmlElementId';

export class CameraHudController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  tick(): void {
    const cameraEntity = this.entity.engine.entities.get(EntityName.Environment);
    const cameraPositionWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CameraPosition);
    const cameraRotationWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CameraRotation);

    const prettyPosition = cameraEntity.getProperty<Vector3>(CameraPositionProperty)
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    cameraPositionWrapper.innerText = `[${prettyPosition.join(', ')}]`;

    const prettyRotation = cameraEntity.getProperty<Quaternion>(CameraRotationProperty)
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    cameraRotationWrapper.innerText = `[${prettyRotation.join(', ')}]`;
  }

}
