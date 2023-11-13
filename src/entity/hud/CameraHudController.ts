import { getHtmlElementByIdOrThrow } from '../../utils/getHtmlElementOrThrow';
import {Controller} from "../commons/Controller";
import {Entity} from "../commons/Entity";
import { getVisualEntityOrThrow } from '../commons/utils/getVisualEntityOrThrow';
import {EntityName} from "../commons/EntityName";
import {HtmlElementId} from "../../HtmlElementId";

export class CameraHudController implements Controller {
  entity: Entity | undefined;

  update(): void {
    const cameraPossibleEntity = this.entity?.entityManager.get(EntityName.Environment);
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
