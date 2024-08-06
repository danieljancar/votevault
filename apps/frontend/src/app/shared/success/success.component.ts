import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent {
  @Input() title = 'Success'
  @Input() message = 'Operation completed successfully'
  @Input() action = 'OK'
  @Input() route = '/'
  @Input() callback: (() => void) | null = null
  @Output() actionClicked = new EventEmitter<void>()

  constructor(private router: Router) {}

  onActionClick(): void {
    if (this.callback) {
      this.callback()
    } else {
      this.router.navigate([this.route])
    }
    this.actionClicked.emit()
  }
}
