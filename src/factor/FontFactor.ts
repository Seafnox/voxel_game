import { TopicEmitter } from 'src/emitter/TopicEmitter';
import { Factor } from 'src/engine/Factor';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export const enum FontFactorTopic {
  Progress = 'progress',
}

export class FontFactor extends TopicEmitter implements Factor<Font[]> {
  private _fonts: Record<string, Font> = {};
  private _fontInProgress: Record<string, boolean> = {};

  get value(): Font[] {
    return Object.values(this._fonts);
  }

  registerFont(fontName: string, resourceLink: string) {
    if (fontName in this._fontInProgress) return;
    if (fontName in this._fonts) return;

    this._fontInProgress[fontName] = false;
    const loader = new FontLoader();
    loader.load(
      resourceLink,
      font => this.addFont(fontName, font),
      progress => {
        this.emit<ProgressEvent>(FontFactorTopic.Progress, progress)
      },
      error => {
        console.error(error);
        delete this._fontInProgress[fontName];
      }
    );
  }

  private addFont(fontName: string, font: Font) {
    this._fonts[fontName] = font;
    this.emit<Font>(fontName, font);
  }
}
