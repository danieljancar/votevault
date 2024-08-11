import { Component, Input } from '@angular/core'
import { SuccessComponent } from '../../../shared/feedback/success/success.component'

@Component({
  selector: 'app-thanks',
  standalone: true,
  imports: [SuccessComponent],
  templateUrl: './thanks.component.html',
  styleUrl: './thanks.component.css',
})
export class ThanksComponent {
  @Input({ required: true }) voteId = ''
}
