import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './share.component.html',
  styleUrl: './share.component.css',
})
export class ShareComponent {
  @Input({ required: true }) voteId: string = ''

  public copyLinkToClipboard(voteId: string): void {
    const url = 'https://vv.danieljancar.dev/voting/' + voteId
    navigator.clipboard.writeText(url)
  }
}
