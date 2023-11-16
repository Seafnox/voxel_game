import { Controller } from 'src/engine/Controller';
import { EntityName } from 'src/engine/EntityName';
import { VisualEntityProperty } from 'src/entity/VisualEntityProperty';
import { HtmlElementId } from 'src/HtmlElementId';
import { getHtmlElementByIdOrThrow } from 'src/utils/getHtmlElementOrThrow';
import { Vector3, Quaternion } from 'three';

export class CharacterHudController extends Controller {
  update(): void {
    const characterEntity = this.entity.engine.entities.get(EntityName.Player);
    const characterPositionWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterPosition);
    const characterRotationWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterRotation);
    const characterVelocityWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterVelocity);

    const prettyPosition = characterEntity.getProperty<Vector3>(VisualEntityProperty.Position)
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    characterPositionWrapper.innerText =
      `[${prettyPosition.join(', ')}]`;

    const prettyRotation = characterEntity.getProperty<Quaternion>(VisualEntityProperty.Rotation)
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    characterRotationWrapper.innerText =
      `[${prettyRotation.join(', ')}]`;

    characterVelocityWrapper.innerText =
      characterEntity.getProperty<Vector3>(VisualEntityProperty.Velocity).length().toFixed(3);
  }

}
