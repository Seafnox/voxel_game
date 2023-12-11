import { Controller, ControllerConstructor } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';

export class ControllerManager {
  private controllerMap: Record<string, Controller> = {};

  constructor(
    private gameEngine: GameEngine,
    private entity: Entity,
  ) {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  register<TController extends Controller>(constructor: ControllerConstructor<TController>, as?: Function): TController {
    const name = as?.name || constructor.name;
    const controller = new constructor(this.gameEngine, this.entity, name);
    this.controllerMap[controller.name] = controller;

    return controller;
  }

  // FIXME bad realisation. should be removed
  // eslint-disable-next-line @typescript-eslint/ban-types
  find<TController extends Controller>(constructor: Function): TController {
    return this.controllerMap[constructor.name] as TController;
  }
}
