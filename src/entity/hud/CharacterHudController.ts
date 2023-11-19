import { Controller } from 'src/engine/Controller';
import { EntityName } from 'src/engine/EntityName';
import { RotationProperty } from 'src/entity/ActivityRotationController';
import { PositionProperty } from 'src/entity/PositionController';
import { VelocityProperty } from 'src/entity/VelocityController';
import { HtmlElementId } from 'src/HtmlElementId';
import { getHtmlElementByIdOrThrow } from 'src/utils/getHtmlElementOrThrow';
import { Vector3, Quaternion } from 'three';

export class CharacterHudController extends Controller {
  update(): void {
    const characterEntity = this.entity.engine.entities.get(EntityName.Player);
    const characterPositionWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterPosition);
    const characterRotationWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterRotation);
    const characterVelocityWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterVelocity);

    const prettyPosition = characterEntity.getProperty<Vector3>(PositionProperty)
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    characterPositionWrapper.innerText =
      `[${prettyPosition.join(', ')}]`;

    const prettyRotation = characterEntity.getProperty<Quaternion>(RotationProperty)
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    characterRotationWrapper.innerText =
      `[${prettyRotation.join(', ')}]`;

    const prettyVelocity = characterEntity.getProperty<Vector3>(VelocityProperty)
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    const calculatedVelocity = characterEntity.getProperty<Vector3>(VelocityProperty).length().toFixed(3);

    characterVelocityWrapper.innerText =
      `${calculatedVelocity} [${prettyVelocity.join(', ')}]`;
  }

}
