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
  @Input({ required: true }) voteId = ''
  @Input({ required: true }) voteTitle = ''

  public copyLinkToClipboard(voteId: string): void {
    const url = 'https://vv.danieljancar.dev/#/voting/' + voteId
    navigator.clipboard.writeText(url)
  }

  downloadVoteID() {
    const voteIdData = `Vote ID: ${this.voteId}`
    const blob = new Blob([voteIdData], { type: 'text/plain;charset=utf-8' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${this.voteTitle}_vote_id.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }
}
