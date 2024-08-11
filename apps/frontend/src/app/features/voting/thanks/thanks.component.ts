import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-thanks',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './thanks.component.html',
  styleUrl: './thanks.component.css',
})
export class ThanksComponent {
  @Input({ required: true }) voteId = ''
}
