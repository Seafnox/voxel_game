import {Controller} from "../commons/Controller";
import {Entity} from "../commons/Entity";
import {VisualEntity} from "../commons/VisualEntity";
import {EntityName} from "../commons/EntityName";
import {HtmlElementId} from "../../HtmlElementId";

export class CameraHudController implements Controller {
  entity: Entity | undefined;

  update(): void {
    const cameraEntity = this.entity?.entityManager?.get(EntityName.Environment);
    const cameraPositionWrapper = document.getElementById(HtmlElementId.CameraPosition);
    const cameraRotationWrapper = document.getElementById(HtmlElementId.CameraRotation);

    if (!cameraEntity) return;
    if (!cameraPositionWrapper) return;
    if (!cameraRotationWrapper) return;

    if (!(cameraEntity instanceof VisualEntity)) {
      throw new Error(`Can't mace calculation for 3d Object in simple Entity. Use ${VisualEntity.name}`);
    }

    const prettyPosition = cameraEntity.getPosition()
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    cameraPositionWrapper.innerText = `[${prettyPosition.join(', ')}]`;

    const prettyRotation = cameraEntity.getRotation()
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    cameraRotationWrapper.innerText = `[${prettyRotation.join(', ')}]`
  }

}
