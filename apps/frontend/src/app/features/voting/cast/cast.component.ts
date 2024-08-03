import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Keypair, SorobanRpc } from '@stellar/stellar-sdk'
import { CastVoteService } from '../../../core/stellar/castVote.service'
import { TEST_ACCOUNT } from '../../../config/config'

@Component({
  selector: 'app-cast',
  standalone: true,
  imports: [],
  templateUrl: './cast.component.html',
  styleUrl: './cast.component.css',
})
export class CastComponent implements OnInit {
  sourceKeypair = Keypair.fromSecret(TEST_ACCOUNT)

  server = new SorobanRpc.Server('https://soroban-testnet.stellar.org')
  currentOption = ''

  @Output() castedEvent = new EventEmitter<boolean>()

  @Input({ required: true }) voteId = ''
  @Input({ required: true }) optionsArr: Array<string> = []

  isLoading = false

  hasError = false
  errorMessage = ''

  constructor(private castVoteService: CastVoteService) {}

  ngOnInit() {
    this.isLoading = false
  }

  async submitVote() {
    this.isLoading = true
    this.hasError = false
    const result = await this.castVoteService.castVote(
      this.server,
      this.sourceKeypair,
      this.voteId,
      this.currentOption,
    )

    this.isLoading = false

    if (
      result?.errorMessage === undefined ||
      result?.hasError === undefined ||
      result?.isLoading === undefined
    ) {
      this.hasError = true
      this.errorMessage = 'An unexpected Error occurred'
      return
    }

    if (!result.hasError) {
      this.castedEvent.emit(true)
    }

    this.hasError = result.hasError
    this.errorMessage = result.errorMessage
  }
}
