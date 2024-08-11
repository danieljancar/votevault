import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SorobanRpc } from '@stellar/stellar-sdk'
import { Keypair } from '@stellar/typescript-wallet-sdk'
import { GetVoteResultsService } from '../../../core/stellar/getVoteResults.service'
import { VoteConfigService } from '../../../core/vote-transaction.service'
import { GetVoteService } from '../../../core/stellar/getVote.service'
import { CheckUserVotedService } from '../../../core/stellar/checkUserVoted.service'
import { from, of, Subscription } from 'rxjs'
import {
  catchError,
  delay,
  finalize,
  retryWhen,
  switchMap,
} from 'rxjs/operators'
import { LoadingComponent } from '../../../shared/feedback/loading/loading.component'
import { ErrorComponent } from '../../../shared/feedback/error/error.component'

@Component({
  selector: 'app-results',
  standalone: true,
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  imports: [LoadingComponent, ErrorComponent],
})
export class ResultsComponent implements OnInit, OnDestroy {
  public hasAlreadyVoted = false
  public isLoading = true
  public hasError = false
  public errorMessage = ''
  public voteId = ''
  public dataArr: Array<string> = []
  public resultArr: Array<{ key: string; val: string }> = []
  public totalVotes = 0
  protected readonly parseInt = parseInt
  private sourceKeypair!: Keypair
  private server!: SorobanRpc.Server
  private routeSubscription!: Subscription

  constructor(
    private route: ActivatedRoute,
    private getVoteResultsService: GetVoteResultsService,
    private getVoteService: GetVoteService,
    private voteConfigService: VoteConfigService,
    private checkUserVotedService: CheckUserVotedService,
  ) {}

  public ngOnInit(): void {
    this.resetData()

    this.routeSubscription = this.route.params
      .pipe(
        switchMap(params => {
          this.voteId = params['id']
          this.isLoading = true
          this.hasError = false
          return from(this.initializeComponent())
        }),
      )
      .subscribe({
        error: error =>
          this.handleError('Failed to initialize the component.', error),
      })
  }

  public ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    this.resetData()
  }

  public exportToCSV(): void {
    const headers = ['Option', 'Votes']
    const rows = this.resultArr.map(result => [result.key, result.val])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vote_results_${this.voteId}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  private resetData(): void {
    this.dataArr = []
    this.resultArr = []
    this.totalVotes = 0
  }

  private async initializeComponent(): Promise<void> {
    this.resetData()
    const config = await this.voteConfigService.getBaseVoteConfig()
    this.server = config.server
    this.sourceKeypair = config.sourceKeypair
    await this.loadVoteDataWithRetry()
  }

  private async loadVoteDataWithRetry(): Promise<void> {
    await of(null)
      .pipe(
        switchMap(() => from(this.loadVoteData())),
        retryWhen(errors =>
          errors.pipe(
            delay(2000),
            switchMap((error, index) => {
              if (index >= 2) {
                return of(error)
              }
              return of(null)
            }),
          ),
        ),
        catchError(error => {
          this.handleError('Failed to load vote data after retries.', error)
          return of(null)
        }),
        finalize(() => (this.isLoading = false)),
      )
      .toPromise()
  }

  private async loadVoteData(): Promise<void> {
    await this.checkIfUserHasVoted()
    await this.getVoteData()
    await this.getVoteResults()
    this.validateDataLoad()
  }

  private validateDataLoad(): void {
    if (!this.dataArr.length || !this.resultArr.length) {
      throw new Error('Failed to load all necessary vote data.')
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
      throw new Error(result.errorMessage)
    }
    if (result) {
      this.hasAlreadyVoted = result.hasVoted
    }
  }

  private async getVoteData(): Promise<void> {
    const result = await this.getVoteService.getVote(
      this.server,
      this.sourceKeypair,
      this.voteId,
    )
    if (result?.hasError) {
      throw new Error(result.errorMessage)
    }
    if (result) {
      this.dataArr = result.dataArr || []
    }
  }

  private async getVoteResults(): Promise<void> {
    const result = await this.getVoteResultsService.getVoteResults(
      this.server,
      this.sourceKeypair,
      this.voteId,
    )

    if (result?.hasError) {
      throw new Error(result.errorMessage)
    }

    if (result) {
      this.resultArr = result.dataArr || []
    }
    this.totalVotes = this.resultArr.reduce(
      (sum, option) => sum + parseInt(option.val, 10),
      0,
    )
  }

  private handleError(message: string, error: any): void {
    console.error(message, error)
    this.hasError = true
    this.errorMessage = message
    this.isLoading = false
  }
}
