import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GetVoteService } from '../../core/stellar/getVote.service'
import { GetVoteOptionService } from '../../core/stellar/getVoteOption.service'
import { GetVoteResultsService } from '../../core/stellar/getVoteResults.service'
import { CheckUserVotedService } from '../../core/stellar/checkUserVoted.service'
import { CastComponent } from './cast/cast.component'
import { ResultsComponent } from './results/results.component'
import { ThanksComponent } from './thanks/thanks.component'
import { LoadingComponent } from '../../shared/feedback/loading/loading.component'
import { ErrorComponent } from '../../shared/feedback/error/error.component'
import { Subscription } from 'rxjs'
import { SorobanRpc } from '@stellar/stellar-sdk'
import { Keypair } from '@stellar/typescript-wallet-sdk'
import { VoteConfigService } from '../../core/vote-transaction.service'

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
  private sourceKeypair!: Keypair
  private server!: SorobanRpc.Server
  private routeParamsSubscription!: Subscription

  constructor(
    private route: ActivatedRoute,
    private getVoteService: GetVoteService,
    private getVoteOptionService: GetVoteOptionService,
    private getVoteResultsService: GetVoteResultsService,
    private checkUserVotedService: CheckUserVotedService,
    private voteConfigService: VoteConfigService,
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      const config = await this.voteConfigService.getBaseVoteConfig()
      this.server = config.server
      this.sourceKeypair = config.sourceKeypair

      this.routeParamsSubscription = this.route.params.subscribe(
        async params => {
          this.voteId = params['id']
          await this.initializeData()
        },
      )
    } catch (error) {
      console.error('Error initializing voting component:', error)
      this.hasError = true
      this.errorMessage = 'Failed to initialize voting component.'
      this.isLoading = false
    }
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

  private async initializeData(): Promise<void> {
    this.isLoading = true
    this.dataArr = []
    this.optionsArr = []
    this.resultArr = []
    await this.getVoteData()
    await this.checkIfUserHasVoted()
    await this.getVoteOptions()
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
