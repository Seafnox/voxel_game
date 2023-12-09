import { EventSystem } from 'src/engine/EventSystem';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export const enum FontEvent {
  Progress = 'progress',
}

export class FontSystem extends EventSystem {
  private _fonts: Record<string, Font> = {};
  private _fontInProgress: Record<string, boolean> = {};

  register(fontName: string, resourceLink: string) {
    if (fontName in this._fontInProgress) return;
    if (fontName in this._fonts) return;

    this._fontInProgress[fontName] = false;
    const loader = new FontLoader();
    loader.load(
      resourceLink,
      font => this.add(fontName, font),
      progress => {
        this.emit<ProgressEvent>(FontEvent.Progress, progress)
      },
      error => {
        console.error(error);
        delete this._fontInProgress[fontName];
      }
    );
  }

  private add(fontName: string, font: Font) {
    this._fonts[fontName] = font;
    this.emit<Font>(fontName, font);
  }
}
