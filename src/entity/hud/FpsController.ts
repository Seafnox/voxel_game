import {Component} from "../commons/Component";
import {Entity} from "../commons/Entity";

export class FpsController implements Component {
  entity: Entity | undefined;
  private tickFrames: number[] = [];
  static fpsId = 'fps';

  update(deltaTime: number) {
    if (this.tickFrames.length >= 1000) {
      this.tickFrames = this.tickFrames.slice(this.tickFrames.length - 200);
    }

    this.tickFrames.push(deltaTime);
    const fpsWrapper = document.getElementById(FpsController.fpsId);
    const sectionTicks = this.tickFrames.slice(this.tickFrames.length - 200);
    const totalSectionTime = sectionTicks.reduce((a, b) => a + b, 0);
    if (fpsWrapper) {
      fpsWrapper.innerText = Math.floor(1000 * sectionTicks.length / totalSectionTime).toString();
    }
  }
}
