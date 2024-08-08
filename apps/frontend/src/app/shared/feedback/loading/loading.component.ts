import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
})
export class LoadingComponent {
  @Input() loading = true
  @Input() message = 'Loading...'
  @Input() marginTop = '5'
  @Input() marginBottom = '0'
}
