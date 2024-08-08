import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GetVoteService } from '../../core/stellar/getVote.service'
import { Keypair, SorobanRpc } from '@stellar/stellar-sdk'
import { TEST_ACCOUNT } from '../../config/config'
import { Location } from '@angular/common'
import { CastComponent } from './cast/cast.component'
import { ResultsComponent } from './results/results.component'
import { GetVoteOptionService } from '../../core/stellar/getVoteOption.service'
import { GetVoteResultsService } from '../../core/stellar/getVoteResults.service'
import { ThanksComponent } from './thanks/thanks.component'
import { CheckUserVotedService } from '../../core/stellar/checkUserVoted.service'
import { LoadingComponent } from '../../shared/feedback/loading/loading.component'
import { ErrorComponent } from '../../shared/feedback/error/error.component'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [
    CastComponent,
    ResultsComponent,
    ThanksComponent,
    LoadingComponent,
    ErrorComponent,
  ],
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.css'],
})
export class VotingComponent implements OnInit, OnDestroy {
  public hasAlreadyVoted = false
  public voteId = ''
  public isLoading = true
  public dataArr: Array<string> = []
  public optionsArr: Array<string> = []
  public resultArr: Array<{ key: string; val: string }> = []
  public hasError = false
  public errorMessage = ''
  private sourceKeypair = Keypair.fromSecret(TEST_ACCOUNT)
  private server = new SorobanRpc.Server('https://soroban-testnet.stellar.org')
  private routeParamsSubscription!: Subscription

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private getVoteService: GetVoteService,
    private getVoteOptionService: GetVoteOptionService,
    private getVoteResultsService: GetVoteResultsService,
    private checkUserVotedService: CheckUserVotedService,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.routeParamsSubscription = this.route.params.subscribe(async params => {
      this.voteId = params['id']
      await this.initializeData()
    })
  }

  public ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe()
    }
    this.resetState()
  }

  public receiveCastedEvent(event: boolean): void {
    this.hasAlreadyVoted = event
  }

  public errorAction(): void {
    this.hasError = false
    this.errorMessage = ''
  }

  private async initializeData(): Promise<void> {
    this.isLoading = true
    this.dataArr = []
    this.optionsArr = []
    this.resultArr = []
    await this.getVoteData()
    await this.checkIfUserHasVoted()
    await this.getVoteOptions()
    await this.getVoteResults()
    this.isLoading = false
  }

  private async getVoteData(): Promise<void> {
    const result = await this.getVoteService.getVote(
      this.server,
      this.sourceKeypair,
      this.voteId,
    )
    if (result?.hasError) {
      this.hasError = true
      this.errorMessage = result.errorMessage
      this.isLoading = false
      return
    }
    if (result) {
      this.dataArr = result.dataArr
    }
  }

  private async getVoteOptions(): Promise<void> {
    const result = await this.getVoteOptionService.getVoteOptions(
      this.server,
      this.sourceKeypair,
      this.voteId,
    )
    if (result?.hasError) {
      this.hasError = true
      this.errorMessage = result.errorMessage
      this.isLoading = false
      return
    }
    if (result) {
      this.optionsArr = result.optionsArr
    }
  }

  private async getVoteResults(): Promise<void> {
    const result = await this.getVoteResultsService.getVoteResults(
      this.server,
      this.sourceKeypair,
      this.voteId,
    )
    if (result?.hasError) {
      this.hasError = true
      this.errorMessage = result.errorMessage
      this.isLoading = false
      return
    }
    if (result) {
      this.resultArr = result.dataArr
    }
  }

  private async checkIfUserHasVoted(): Promise<void> {
    const result = await this.checkUserVotedService.checkIfUserVoted(
      this.server,
      this.sourceKeypair,
      this.voteId,
      this.sourceKeypair.publicKey(),
    )
    if (result?.hasError) {
      this.hasError = true
      this.errorMessage = result.errorMessage
      this.isLoading = false
      return
    }
    if (result) {
      this.hasAlreadyVoted = result.hasVoted
    }
  }

  private resetState(): void {
    this.hasAlreadyVoted = false
    this.voteId = ''
    this.isLoading = true
    this.dataArr = []
    this.optionsArr = []
    this.resultArr = []
    this.hasError = false
    this.errorMessage = ''
  }
}
