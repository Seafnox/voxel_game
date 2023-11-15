import { getHtmlElementByIdOrThrow } from '../../utils/getHtmlElementOrThrow';
import {Controller} from "../../engine/Controller";
import {Entity} from "../../engine/Entity";
import { GameEngine } from '../../engine/GameEngine';
import { getVisualEntityOrThrow } from '../utils/getVisualEntityOrThrow';
import {EntityName} from "../../engine/EntityName";
import {HtmlElementId} from "../../HtmlElementId";

export class CameraHudController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);
  }

  update(): void {
    const cameraPossibleEntity = this.entity.engine.entities.get(EntityName.Environment);
    const cameraPositionWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CameraPosition);
    const cameraRotationWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CameraRotation);
    const cameraEntity = getVisualEntityOrThrow(this, cameraPossibleEntity);

    const prettyPosition = cameraEntity.getPosition()
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    cameraPositionWrapper.innerText = `[${prettyPosition.join(', ')}]`;

    const prettyRotation = cameraEntity.getRotation()
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    cameraRotationWrapper.innerText = `[${prettyRotation.join(', ')}]`;
  }

}
