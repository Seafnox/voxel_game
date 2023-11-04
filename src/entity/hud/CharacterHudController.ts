import {Controller} from "../commons/Controller";
import {Entity} from "../commons/Entity";
import {EntityName} from "../commons/EntityName";
import {HtmlElementId} from "../../HtmlElementId";
import {VisualEntity} from "../commons/VisualEntity";

export class CharacterHudController implements Controller {
  entity: Entity | undefined;

  update(): void {
    const characterEntity = this.entity?.entityManager?.get(EntityName.Player);
    const characterPositionWrapper = document.getElementById(HtmlElementId.CharacterPosition);
    const characterRotationWrapper = document.getElementById(HtmlElementId.CharacterRotation);
    const characterVelocityWrapper = document.getElementById(HtmlElementId.CharacterVelocity);

    if (!characterEntity) return;
    if (!characterPositionWrapper) return;
    if (!characterRotationWrapper) return;
    if (!characterVelocityWrapper) return;

    if (!(characterEntity instanceof VisualEntity)) {
      throw new Error(`Can't mace calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
    }

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
