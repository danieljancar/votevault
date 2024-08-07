import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GetVoteService } from '../../core/stellar/getVote.service'
import { Keypair, SorobanRpc } from '@stellar/stellar-sdk'
import { Location } from '@angular/common'
import { CastComponent } from './cast/cast.component'
import { ResultsComponent } from './results/results.component'
import { GetVoteOptionService } from '../../core/stellar/getVoteOption.service'
import { GetVoteResultsService } from '../../core/stellar/getVoteResults.service'
import { ThanksComponent } from './thanks/thanks.component'
import { CheckUserVotedService } from '../../core/stellar/checkUserVoted.service'
import { AuthService } from '../../core/auth.service'

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [CastComponent, ResultsComponent, ThanksComponent],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.css',
})
export class VotingComponent implements OnInit {
  sourceKeypair: Keypair
  server = new SorobanRpc.Server('https://soroban-testnet.stellar.org')

  hasAlreadyVoted = false

  voteId = ''
  isLoading = true
  dataArr: Array<string> = []
  optionsArr: Array<string> = []
  resultArr: Array<{ key: string; val: string }> = []

  hasError = false
  errorMessage = ''

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private getVoteService: GetVoteService,
    private getVoteOptionService: GetVoteOptionService,
    private getVoteResultsService: GetVoteResultsService,
    private checkUserVotedService: CheckUserVotedService,
    private authService: AuthService,
  ) {
    this.sourceKeypair = Keypair.fromSecret(this.authService.getPrivateKey())
  }

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.voteId = params['id']
    })

    if (!this.hasAlreadyVoted) {
      this.isLoading = true
      await this.getVoteData()
      await this.checkIfUserHasVoted()
      await this.getVoteOptions()
      await this.getVoteResults()
      this.isLoading = false
    }
  }

  async getVoteData() {
    const result = await this.getVoteService.getVote(
      this.server,
      this.sourceKeypair,
      this.voteId,
    )
    if (
      result?.errorMessage === undefined ||
      result?.hasError === undefined ||
      result?.dataArr === undefined ||
      result?.isLoading === undefined
    ) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = 'An unexpected Error occurred'
      return
    }

    this.dataArr = result.dataArr
    if (result.hasError) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = result.errorMessage
    }
  }

  async getVoteOptions() {
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
    if (result.hasError) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = result.errorMessage
    }
  }

  async getVoteResults() {
    const result = await this.getVoteResultsService.getVoteResults(
      this.server,
      this.sourceKeypair,
      this.voteId,
    )
    if (
      result?.errorMessage === undefined ||
      result?.hasError === undefined ||
      result?.isLoading === undefined ||
      result?.dataArr === undefined
    ) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = 'An unexpected Error occurred'
      return
    }

    this.resultArr = result.dataArr
    if (result.hasError) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = result.errorMessage
    }
  }

  async checkIfUserHasVoted() {
    const result = await this.checkUserVotedService.checkIfUserVoted(
      this.server,
      this.sourceKeypair,
      this.voteId,
      this.sourceKeypair.publicKey(),
    )
    if (
      result?.isLoading === undefined ||
      result?.hasError === undefined ||
      result?.hasVoted === undefined
    ) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = 'An unexpected Error occurred'
      return
    }

    if (result.hasError) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage = result.errorMessage
    } else {
      this.hasAlreadyVoted = result.hasVoted
    }
  }

  receiveCastedEvent(event: boolean) {
    this.hasAlreadyVoted = event
  }

  goBack() {
    this.location.back()
  }
}
