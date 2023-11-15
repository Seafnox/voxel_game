import { getHtmlElementByIdOrThrow } from '../../utils/getHtmlElementOrThrow';
import {Controller} from "../commons/Controller";
import {Entity} from "../commons/Entity";
import {EntityName} from "../commons/EntityName";
import {HtmlElementId} from "../../HtmlElementId";
import { GameEngine } from '../commons/GameEngine';
import { getVisualEntityOrThrow } from '../commons/utils/getVisualEntityOrThrow';

export class CharacterHudController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);
  }

  update(): void {
    const characterEntity = getVisualEntityOrThrow(this, this.entity.engine.entities.get(EntityName.Player));
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
