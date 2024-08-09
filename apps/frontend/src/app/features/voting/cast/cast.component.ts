import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core'
import { Router } from '@angular/router'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { CastVoteService } from '../../../core/stellar/castVote.service'
import { BaseVoteConfig } from '../../../types/vote.types'
import { ConfirmReloadService } from '../../../shared/services/confirm-reload/confirm-reload.service'
import { LoadingComponent } from '../../../shared/feedback/loading/loading.component'
import { ErrorComponent } from '../../../shared/feedback/error/error.component'
import { NgClass } from '@angular/common'
import { GetVoteOptionService } from '../../../core/stellar/getVoteOption.service'
import { VoteConfigService } from '../../../core/vote-transaction.service'

@Component({
  selector: 'app-cast',
  standalone: true,
  imports: [LoadingComponent, ErrorComponent, NgClass, ReactiveFormsModule],
  templateUrl: './cast.component.html',
  styleUrls: ['./cast.component.css'],
})
export class CastComponent implements OnChanges {
  @Input() public voteId = ''
  @Input() public optionsArr: Array<string> = []
  @Input() public dataArr: Array<string> = []
  @Output() public castedEvent = new EventEmitter<boolean>()
  @Output() public showResultsEvent = new EventEmitter<boolean>()

  public voteForm: FormGroup
  public isLoading = false
  public hasError = false
  public errorMessage = ''
  private baseVoteConfig!: BaseVoteConfig

  constructor(
    private fb: FormBuilder,
    private castVoteService: CastVoteService,
    private confirmReloadService: ConfirmReloadService,
    private voteConfigService: VoteConfigService,
  ) {
    this.voteForm = this.fb.group({
      selectedOption: ['', Validators.required],
    })
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['dataArr'] && changes['dataArr'].currentValue) {
      this.dataArr = this.removeDuplicates(changes['dataArr'].currentValue)
    }
    if (changes['optionsArr'] && changes['optionsArr'].currentValue) {
      this.optionsArr = this.removeDuplicates(
        changes['optionsArr'].currentValue,
      )
    }

    try {
      this.baseVoteConfig = await this.voteConfigService.getBaseVoteConfig()
    } catch (error) {
      console.error('Error fetching vote configuration:', error)
      this.hasError = true
      this.errorMessage = 'Failed to load vote configuration.'
    }
  }

  public async submitVote(): Promise<void> {
    this.isLoading = true
    this.hasError = false

    try {
      const result = await this.castVoteService.castVote(
        this.baseVoteConfig.server,
        this.baseVoteConfig.sourceKeypair,
        this.voteId,
        this.voteForm.value.selectedOption,
      )

      if (result?.hasError) {
        this.hasError = true
        this.errorMessage = result.errorMessage
      } else {
        this.castedEvent.emit(true)
        this.voteForm.markAsPristine()
      }
    } catch (error) {
      this.hasError = true
      this.errorMessage = 'An unexpected error occurred.'
      console.error('Unexpected error:', error)
    } finally {
      this.isLoading = false
    }
  }

  public viewResults(): void {
    if (this.voteForm.dirty) {
      if (!this.confirmReloadService.confirmReload()) {
        return
      }
    }
    this.showResultsEvent.emit(true)
  }

  private removeDuplicates(arr: Array<string>): Array<string> {
    return Array.from(new Set(arr))
  }
}
