import {Controller} from "../commons/Controller";
import {Entity} from "../commons/Entity";
import {HtmlElementId} from "../../HtmlElementId";

export class FpsController implements Controller {
  entity: Entity | undefined;
  private tickFrames: number[] = [];

  update(deltaTime: number) {
    if (this.tickFrames.length >= 1000) {
      this.tickFrames = this.tickFrames.slice(this.tickFrames.length - 200);
    }

    this.tickFrames.push(deltaTime);
    const fpsWrapper = document.getElementById(HtmlElementId.Fps);
    const sectionTicks = this.tickFrames.slice(this.tickFrames.length - 200);
    const totalSectionTime = sectionTicks.reduce((a, b) => a + b, 0);
    if (fpsWrapper) {
      fpsWrapper.innerText = Math.floor(1000 * sectionTicks.length / totalSectionTime).toString();
    }
  }
}
