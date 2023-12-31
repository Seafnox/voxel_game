import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { PositionProperty } from 'src/positioning/PositionProperty';
import { SurfaceHelperSystem } from 'src/surface/SurfaceHelperSystem';
import { GravityAccelerationProperty } from 'src/velocity/GravityAccelerationProperty';
import { GravityProperty } from 'src/velocity/GravityProperty';
import { TickSystem, TickSystemEvent } from 'src/browser/TickSystem';
import { Vector3 } from 'three';

export class GravityAccelerationController extends Controller {
  private defaultAcceleration = new Vector3(0.0, 0.0, 0.0);
  private allowedDistance = 0.1;
  private distanceMultiplier = 3;

  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.entity.properties.register(GravityAccelerationProperty, this.defaultAcceleration);
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Init, this.init.bind(this));
    this.engine.systems.find(TickSystem).on(TickSystemEvent.Tick, this.tick.bind(this));
  }

  init() {
    this.tick();
  }

  tick() {
    const acceleration = this.gravity.clone();
    const playerPosition = this.entityPosition.clone();
    const surfacePosition = this.nearestSurfacePosition.clone();

    if (this.playerOnSurface(playerPosition, surfacePosition)) {
      acceleration.multiplyScalar(0);
    } else {
      if (this.playerUnderSurface(playerPosition, surfacePosition)) {
        acceleration.multiplyScalar(-this.distanceMultiplier);
      }

      acceleration.multiplyScalar(Math.min(
        this.getDistanceBetweenPlayerAndSurface(playerPosition, surfacePosition)*this.distanceMultiplier,
        acceleration.length()
      ))
    }

    this.entity.properties.find(GravityAccelerationProperty).set(acceleration);
  }

  private get entityPosition(): Vector3 {
    return this.entity.properties.find(PositionProperty).get();
  }

  // TODO FEATURE make nearest surface point calculation based on gravity Vector
  private get nearestSurfacePosition(): Vector3 {
    const position = this.entityPosition.clone();
    position.y = this.surfaceHelper.getZCord(position.x, position.z);

    return position;
  }

  private get surfaceHelper(): SurfaceHelperSystem {
    return this.engine.systems.find(SurfaceHelperSystem);
  }

  private get gravity(): Vector3 {
    return this.engine.properties.find(GravityProperty).get();
  }

  private playerOnSurface(playerPosition: Vector3, surfacePosition: Vector3): boolean {
    return this.getDistanceBetweenPlayerAndSurface(playerPosition, surfacePosition) < this.allowedDistance;
  }

  private playerUnderSurface(playerPosition: Vector3, surfacePosition: Vector3): boolean {
    const directionVector = this.getSurfaceDirection(playerPosition, surfacePosition);
    directionVector.multiply(this.gravity.clone());
    const directionSign = Math.sign(directionVector.toArray().reduce((result, value) => result + value, 0));

    return directionSign < 0;
  }

  private getDistanceBetweenPlayerAndSurface(playerPosition: Vector3, surfacePosition: Vector3): number {
    return this.getSurfaceDirection(playerPosition, surfacePosition).length();
  }

  private getSurfaceDirection(playerPosition: Vector3, surfacePosition: Vector3): Vector3 {
    const reversePlayerPosition = playerPosition.clone().multiplyScalar(-1);
    return surfacePosition.clone().add(reversePlayerPosition);
  }
}
