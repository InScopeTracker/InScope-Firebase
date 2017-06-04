import {Component} from '@angular/core';

/**
 * The logic for this modal is borrowed from a solution on Stack Overflow.
 *
 * See https://stackoverflow.com/a/40144809 for further details.
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  public visible = false;
  public visibleAnimate = false;

  /**
   * Show the modal.
   */
  public show(): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
  }

  /**
   * Hide the modal.
   */
  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  /**
   * Close the modal when the surrounding area is clicked.
   */
  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
}
