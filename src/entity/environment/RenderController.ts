import { Controller } from 'src/engine/Controller';
import { Entity } from 'src/engine/Entity';
import { GameEngine } from 'src/engine/GameEngine';
import { CameraFactor } from 'src/factor/CameraFactor';
import { RendererFactor } from 'src/factor/RendererFactor';
import { SceneFactor } from 'src/factor/SceneFactor';
import { HtmlElementId } from 'src/HtmlElementId';
import { TickSystem, TickSystemEvent } from 'src/system/TickSystem';
import { WindowEventSystem, WindowResizeEvent, WindowTopic } from 'src/system/WindowEventSystem';
import { getHtmlElementByIdOrThrow } from 'src/utils/getHtmlElementOrThrow';
import { WebGLRenderer } from 'three';
import { SRGBColorSpace, PCFSoftShadowMap } from 'three/src/constants';

export class RenderController extends Controller {
  constructor(
    engine: GameEngine,
    entity: Entity,
    name: string,
  ) {
    super(engine, entity, name);

    this.configureRenderer();

    this.windowEventSystem.on<WindowResizeEvent>(WindowTopic.Resize, event => {
      const window = event.view!;
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    this.tickSystem.on<number>(TickSystemEvent.Tick, () => {
      const scene = this.engine.factors.find(SceneFactor).scene;
      const camera = this.engine.factors.find(CameraFactor).camera;
      this.renderer.render(scene, camera);
    });
  }

  private get renderer(): WebGLRenderer {
    return this.engine.factors.find(RendererFactor).renderer;
  }

  private get windowEventSystem(): WindowEventSystem {
    return this.engine.systems.find(WindowEventSystem);
  }

  private get tickSystem(): TickSystem {
    return this.engine.systems.find(TickSystem);
  }

  private configureRenderer() {
    const window = this.windowEventSystem.getWindow();

    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.id = HtmlElementId.Scene;

    const container = getHtmlElementByIdOrThrow(HtmlElementId.Container);
    container.appendChild(this.renderer.domElement);
  }
}
