import { getHtmlElementByIdOrThrow } from '../../utils/getHtmlElementOrThrow';
import {Controller} from "../commons/Controller";
import {Entity} from "../commons/Entity";
import {EntityName} from "../commons/EntityName";
import {HtmlElementId} from "../../HtmlElementId";
import { getVisualEntityOrThrow } from '../commons/utils/getVisualEntityOrThrow';
import {VisualEntity} from "../commons/VisualEntity";

export class CharacterHudController implements Controller {
  entity: Entity | undefined;

  update(): void {
    const characterEntity = getVisualEntityOrThrow(this, this.entity?.entityManager.get(EntityName.Player));
    const characterPositionWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterPosition);
    const characterRotationWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterRotation);
    const characterVelocityWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterVelocity);

    const prettyPosition = characterEntity.getPosition()
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    characterPositionWrapper.innerText = `[${prettyPosition.join(', ')}]`;

    const prettyRotation = characterEntity.getRotation()
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    characterRotationWrapper.innerText = `[${prettyRotation.join(', ')}]`;

    const prettyVelocity = characterEntity.getVelocity().length().toFixed(3);
    characterVelocityWrapper.innerText = prettyVelocity;
  }

}
