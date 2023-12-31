import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { CameraProperty } from 'src/camera/CameraProperty';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { getHtmlElementByIdOrThrow } from 'src/utils/getHtmlElementOrThrow';
import {Controller} from 'src/engine/Controller';
import {HtmlElementId} from 'src/HtmlElementId';

export class CameraGuiController extends Controller {
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
    const camera = this.engine.properties.find(CameraProperty).get();
    const cameraPositionWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CameraPosition);
    const cameraRotationWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CameraRotation);

    const prettyPosition = camera.position
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    cameraPositionWrapper.innerText = `[${prettyPosition.join(', ')}]`;

    const prettyRotation = camera.quaternion
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    cameraRotationWrapper.innerText = `[${prettyRotation.join(', ')}]`;
  }

}
