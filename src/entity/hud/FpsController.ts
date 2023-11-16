import { getHtmlElementByIdOrThrow } from 'src/utils/getHtmlElementOrThrow';
import {Controller} from 'src/engine/Controller';
import {HtmlElementId} from 'src/HtmlElementId';

export class FpsController extends Controller {
  private tickFrames: number[] = [];
  update(deltaTime: number) {
    if (this.tickFrames.length >= 1000) {
      this.tickFrames = this.tickFrames.slice(this.tickFrames.length - 200);
    }

    this.tickFrames.push(deltaTime);
    const fpsWrapper = getHtmlElementByIdOrThrow(HtmlElementId.Fps);
    const sectionTicks = this.tickFrames.slice(this.tickFrames.length - 200);
    const totalSectionTime = sectionTicks.reduce((a, b) => a + b, 0);
    fpsWrapper.innerText = Math.floor(1000 * sectionTicks.length / totalSectionTime).toString();
  }
}
