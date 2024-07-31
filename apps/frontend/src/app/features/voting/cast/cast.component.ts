import { Component, OnInit } from '@angular/core'
import { Keypair, SorobanRpc } from '@stellar/stellar-sdk'
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'
import { GetVoteOptionService } from '../../../core/stellar/getVoteOption.service'
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

  voteId = ''
  currentOption = ''
  optionsArr = new Array<string>()
  isLoading = true

  hasError = false
  errorMessage = ''

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private getVoteOptionService: GetVoteOptionService,
    private castVoteService: CastVoteService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.voteId = params['id']
    })
    await this.getVoteOptions()
  }

  async getVoteOptions() {
    this.isLoading = true
    const result = await this.getVoteOptionService.getVoteOptions(
      this.server,
      this.sourceKeypair,
      this.voteId,
    )
    if (
      result?.errorMessage === undefined ||
      result?.hasError === undefined ||
      result?.optionsArr === undefined ||
      result?.isLoading === undefined
    ) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = 'An unexpected Error occurred'
      return
    }

    this.optionsArr = result.optionsArr
    this.isLoading = result.isLoading
    this.hasError = result.hasError
    this.errorMessage = result.errorMessage
  }

  async submitVote() {
    this.isLoading = true
    const result = await this.castVoteService.castVote(
      this.server,
      this.sourceKeypair,
      this.voteId,
      this.currentOption,
    )

    if (
      result?.errorMessage === undefined ||
      result?.hasError === undefined ||
      result?.isLoading === undefined
    ) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = 'An unexpected Error occurred'
      return
    }

    this.isLoading = result.isLoading
    this.hasError = result.hasError
    this.errorMessage = result.errorMessage
  }

  goBack() {
    this.location.back()
  }
}
