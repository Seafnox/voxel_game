import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { EntityName } from 'src/engine/EntityName';
import { GameEngine } from 'src/engine/GameEngine';
import { HtmlElementId } from 'src/HtmlElementId';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { RotationProperty } from 'src/positioning/RotationProperty';
import { getHtmlElementByIdOrThrow } from 'src/utils/getHtmlElementOrThrow';
import { VelocityProperty } from 'src/velocity/VelocityProperty';

export class CharacterGuiController extends Controller {
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
    const characterEntity = this.entity.engine.entities.find(EntityName.Player);
    const characterPositionWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterPosition);
    const characterRotationWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterRotation);
    const characterVelocityWrapper = getHtmlElementByIdOrThrow(HtmlElementId.CharacterVelocity);

    const prettyPosition = characterEntity.properties.find(PositionProperty).get()
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    characterPositionWrapper.innerText =
      `[${prettyPosition.join(', ')}]`;

    const prettyRotation = characterEntity.properties.find(RotationProperty).get()
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    characterRotationWrapper.innerText =
      `[${prettyRotation.join(', ')}]`;

    const prettyVelocity = characterEntity.properties.find(VelocityProperty).get()
      .toArray()
      .map(coord => coord.toFixed(3).padStart(3, ' '));
    const calculatedVelocity = characterEntity.properties.find(VelocityProperty).get().length().toFixed(3);

    characterVelocityWrapper.innerText =
      `${calculatedVelocity} [${prettyVelocity.join(', ')}]`;
  }

}
