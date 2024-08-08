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
import { getBaseVoteConfig } from '../../../utils/vote-transactions.util'
import { ConfirmReloadService } from '../../../shared/services/confirm-reload/confirm-reload.service'
import { LoadingComponent } from '../../../shared/feedback/loading/loading.component'
import { ErrorComponent } from '../../../shared/feedback/error/error.component'
import { NgClass } from '@angular/common'
import { GetVoteOptionService } from '../../../core/stellar/getVoteOption.service'

@Component({
  selector: 'app-cast',
  standalone: true,
  imports: [LoadingComponent, ErrorComponent, NgClass, ReactiveFormsModule],
  templateUrl: './cast.component.html',
  styleUrls: ['./cast.component.css'],
})
export class CastComponent implements OnChanges {
  @Input() public voteId: string = ''
  @Input() public optionsArr: Array<string> = []
  @Input() public dataArr: Array<string> = []
  @Output() public castedEvent = new EventEmitter<boolean>()

  public voteForm: FormGroup
  public isLoading: boolean = false
  public hasError: boolean = false
  public errorMessage: string = ''
  private baseVoteConfig: BaseVoteConfig = getBaseVoteConfig()

  constructor(
    private fb: FormBuilder,
    private castVoteService: CastVoteService,
    private router: Router,
    private confirmReloadService: ConfirmReloadService,
    private getVoteOptionService: GetVoteOptionService,
  ) {
    this.voteForm = this.fb.group({
      selectedOption: ['', Validators.required],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataArr'] && changes['dataArr'].currentValue) {
      this.dataArr = changes['dataArr'].currentValue
    }
    if (changes['optionsArr'] && changes['optionsArr'].currentValue) {
      this.optionsArr = changes['optionsArr'].currentValue
    }
  }

  public async submitVote(): Promise<void> {
    this.isLoading = true
    this.hasError = false
    const result = await this.castVoteService.castVote(
      this.baseVoteConfig.server,
      this.baseVoteConfig.sourceKeypair,
      this.voteId,
      this.voteForm.value.selectedOption,
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
      this.voteForm.markAsPristine()
    }

    this.hasError = result.hasError
    this.errorMessage = result.errorMessage
  }

  public viewResults(): void {
    if (this.voteForm.dirty) {
      if (!this.confirmReloadService.confirmReload()) {
        return
      }
    }
    this.router.navigate(['/voting/results', this.voteId])
  }

  public errorAction(): void {
    this.hasError = false
    this.errorMessage = ''
  }
}
