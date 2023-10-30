import {Component} from "../commons/Component";
import {Entity} from "../commons/Entity";

export class CharacterHudController implements Component {
  entity: Entity | undefined;

  update(deltaTime: number): void {
  }

}
