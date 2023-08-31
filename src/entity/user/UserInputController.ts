export class UserInputController {
  private boundedOnKeyDown = this.onKeyDown.bind(this);
  private boundedOnKeyUp = this.onKeyUp.bind(this);
  private boundedOnMouseUp = this.onMouseUp.bind(this);
  forward = false;
  left = false;
  backward = false;
  right = false;
  space = false;
  shift = false;

  constructor() {
    document.addEventListener('keydown', this.boundedOnKeyDown, false);
    document.addEventListener('keyup', this.boundedOnKeyUp, false);
    document.addEventListener('mouseup', this.boundedOnMouseUp, false);
  }

  private onKeyDown(event: KeyboardEvent) {
    this.setAction(event.keyCode, true);
    console.log('onKeyDown: ', event.keyCode, event.key);
  }

  private onKeyUp(event: KeyboardEvent) {
    this.setAction(event.keyCode, false);
    console.log('onKeyUp: ', event.keyCode, event.key);
  }

  private setAction(actionCode: number, value: boolean) {
    switch (actionCode) {
      case 87: // w
        this.forward = value;
        break;
      case 65: // a
        this.left = value;
        break;
      case 83: // s
        this.backward = value;
        break;
      case 68: // d
        this.right = value;
        break;
      case 32: // SPACE
        this.space = value;
        break;
      case 16: // SHIFT
        this.shift = value;
        break;
    }
  }

  private onMouseUp(event: MouseEvent) {
    console.log('onMouseUp: click', event);
  }
}
