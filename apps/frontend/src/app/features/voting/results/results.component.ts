import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css',
})
export class ResultsComponent {
  @Input({ required: true }) voteId = ''
  @Input({ required: true }) dataArr: Array<string> = []
  @Input({ required: true }) resultArr: Array<{ key: string; val: string }> = []
}
