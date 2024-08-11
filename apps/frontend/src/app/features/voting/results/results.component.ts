import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { SorobanRpc } from '@stellar/stellar-sdk'
import { Keypair } from '@stellar/typescript-wallet-sdk'
import { GetVoteResultsService } from '../../../core/stellar/getVoteResults.service'
import { VoteConfigService } from '../../../core/vote-transaction.service'
import { ErrorComponent } from '../../../shared/feedback/error/error.component'
import { LoadingComponent } from '../../../shared/feedback/loading/loading.component'
import { GetVoteService } from '../../../core/stellar/getVote.service'
import { Subscription } from 'rxjs'
import { CheckUserVotedService } from '../../../core/stellar/checkUserVoted.service'

@Component({
  selector: 'app-results',
  standalone: true,
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
  imports: [ErrorComponent, LoadingComponent],
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
    private router: Router,
    private getVoteResultsService: GetVoteResultsService,
    private getVoteService: GetVoteService,
    private voteConfigService: VoteConfigService,
    private checkUserVotedService: CheckUserVotedService,
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      const config = await this.voteConfigService.getBaseVoteConfig()
      this.server = config.server
      this.sourceKeypair = config.sourceKeypair

      this.routeSubscription = this.route.params.subscribe(async params => {
        this.voteId = params['id']
        this.isLoading = true
        this.hasError = false
        await this.loadVoteData()
      })
    } catch (error) {
      this.handleError('Failed to initialize results component.', error)
    }
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

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
  }

  private async loadVoteData(): Promise<void> {
    try {
      await this.getVoteData()
      await this.getVoteResults()
    } catch (error) {
      this.handleError('Failed to load vote data.', error)
    } finally {
      this.isLoading = false
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
      this.dataArr = result.dataArr
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
      this.resultArr = result.dataArr
      this.totalVotes = this.resultArr.reduce(
        (sum, option) => sum + parseInt(option.val, 10),
        0,
      )
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

  private handleError(message: string, error: any): void {
    console.error(message, error)
    this.hasError = true
    this.errorMessage = message
    this.isLoading = false
  }
}
