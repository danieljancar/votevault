import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent {
  @Input() title = 'Error'
  @Input() message = 'An error occurred'
  @Input() action = 'Try again'
  @Input() route = '/'
  @Input() callback: (() => void) | null = null
  @Input() showAction = true
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
