import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { EntityName } from 'src/engine/EntityName';
import { GameEngine } from 'src/engine/GameEngine';
import { RotationProperty, PositionProperty } from 'src/entity/properties/visual';
import { VelocityProperty } from 'src/entity/properties/dynamic';
import { HtmlElementId } from 'src/HtmlElementId';
import { TickSystem, TickSystemEvent } from 'src/system/TickSystem';
import { getHtmlElementByIdOrThrow } from 'src/utils/getHtmlElementOrThrow';
import { Vector3, Quaternion } from 'three';

export class CharacterHudController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

//    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  tick(): void {
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
