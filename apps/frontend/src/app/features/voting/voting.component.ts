import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { GetVoteService } from '../../core/stellar/getVote.service'
import { Keypair, SorobanRpc } from '@stellar/stellar-sdk'
import { TEST_ACCOUNT } from '../../config/config'
import { Location } from '@angular/common'
import { CastComponent } from './cast/cast.component'
import { ResultsComponent } from './results/results.component'
import { GetVoteOptionService } from '../../core/stellar/getVoteOption.service'
import { GetVoteResultsService } from '../../core/stellar/getVoteResults.service'
import { CookieService } from 'ngx-cookie-service'
import { ThanksComponent } from './thanks/thanks.component'

@Component({
  selector: 'app-voting',
  standalone: true,
  imports: [CastComponent, ResultsComponent, ThanksComponent],
  templateUrl: './voting.component.html',
  styleUrl: './voting.component.css',
})
export class VotingComponent implements OnInit {
  sourceKeypair = Keypair.fromSecret(TEST_ACCOUNT)
  server = new SorobanRpc.Server('https://soroban-testnet.stellar.org')

  hasAlreadyVoted = false

  voteId = ''
  isLoading = true
  dataArr: Array<string> = []
  optionsArr: Array<string> = []
  resultArr: Array<{ key: string; val: string }> = []

  hasError = false
  errorMessage = ''

  today!: Date
  startDate!: Date
  endDate!: Date

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private getVoteService: GetVoteService,
    private getVoteOptionService: GetVoteOptionService,
    private getVoteResultsService: GetVoteResultsService,
    private ngxCookieService: CookieService,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(params => {
      this.voteId = params['id']
    })

    this.hasAlreadyVoted = this.ngxCookieService.check(this.voteId)

    if (!this.hasAlreadyVoted) {
      this.today = new Date()
      this.isLoading = true
      await this.getVoteData()
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

    this.startDate = this.parseDate(this.dataArr[2])
    this.endDate = this.parseDate(this.dataArr[3])
    this.isBeforeStartDate()
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

  parseDate(dateStr: string): Date {
    const day = parseInt(dateStr.substring(0, 2), 10)
    const month = parseInt(dateStr.substring(2, 4), 10) - 1
    const year = parseInt(dateStr.substring(4, 8), 10)
    return new Date(year, month, day)
  }

  isBeforeStartDate() {
    if (this.today < this.startDate) {
      this.isLoading = false
      this.hasError = true
      this.errorMessage =
        'There was an Error getting this vote ID, please try again.'
    }
  }

  isBetweenDates(): boolean {
    return this.today >= this.startDate && this.today < this.endDate
  }

  isAfterEndDate(): boolean {
    return this.today >= this.endDate
  }

  receiveCastedEvent(event: boolean) {
    this.hasAlreadyVoted = event
  }

  goBack() {
    this.location.back()
  }
}
