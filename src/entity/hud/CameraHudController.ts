import { CameraPositionProperty, CameraRotationProperty } from 'src/entity/properties/camera';
import { Vector3, Quaternion } from 'three';
import { getHtmlElementByIdOrThrow } from 'src/utils/getHtmlElementOrThrow';
import {Controller} from 'src/engine/Controller';
import {EntityName} from 'src/engine/EntityName';
import {HtmlElementId} from 'src/HtmlElementId';

export class CameraHudController extends Controller {
  update(): void {
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
