import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NgClass } from '@angular/common'
import { CreateVoteService } from '../../../core/stellar/createVote.service'
import { LoadingComponent } from '../../../shared/feedback/loading/loading.component'
import { ErrorComponent } from '../../../shared/feedback/error/error.component'
import { SuccessComponent } from '../../../shared/feedback/success/success.component'
import { v4 as uuidv4 } from 'uuid'
import { BaseVoteConfig } from '../../../types/vote.types'
import { ConfirmReloadService } from '../../../shared/services/confirm-reload/confirm-reload.service'
import { CanComponentDeactivate } from '../../../types/can-deactivate.interfaces'
import { VoteConfigService } from '../../../core/vote-transaction.service'

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    LoadingComponent,
    ErrorComponent,
    SuccessComponent,
  ],
})
export class CreateComponent
  implements OnInit, OnDestroy, CanComponentDeactivate
{
  public voteForm: FormGroup
  public isLoading = false
  public hasError = false
  public errorMessage = ''
  public successMessage = ''
  private baseVoteConfig!: BaseVoteConfig

  constructor(
    private fb: FormBuilder,
    private createVoteService: CreateVoteService,
    private confirmReloadService: ConfirmReloadService,
    private voteConfigService: VoteConfigService,
  ) {
    this.voteForm = this.fb.group({
      id: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      options: this.fb.array(
        [],
        [Validators.required, Validators.minLength(2), Validators.maxLength(5)],
      ),
    })
  }

  public get options(): FormArray {
    return this.voteForm.get('options') as FormArray
  }

  public async ngOnInit(): Promise<void> {
    this.voteForm.controls['id'].setValue(this.createVoteId())
    this.addOption()
    this.addOption()

    window.addEventListener('beforeunload', this.beforeUnloadHandler)

    try {
      this.baseVoteConfig = await this.voteConfigService.getBaseVoteConfig()
    } catch (error) {
      console.error('Error fetching vote configuration:', error)
      this.hasError = true
      this.errorMessage = 'Failed to load vote configuration.'
      this.isLoading = false
    }
  }

  public ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler)
  }

  public addOption(): void {
    if (this.options.length < 5) {
      this.options.push(this.createOption())
    }
  }

  public removeOption(index: number): void {
    if (this.options.length > 2) {
      this.options.removeAt(index)
    }
  }

  public async onSubmit(): Promise<void> {
    this.isLoading = true
    this.hasError = false
    this.errorMessage = ''
    this.successMessage = ''

    try {
      const options = this.voteForm.value.options.map(
        (opt: { option: string }) => opt.option,
      )

      const result = await this.createVoteService.createVote(
        this.baseVoteConfig.server,
        this.baseVoteConfig.sourceKeypair,
        this.voteForm.value.id,
        this.voteForm.value.title,
        this.voteForm.value.description,
        options,
      )

      if (!result || result.hasError) {
        this.hasError = true
        if (result) {
          this.errorMessage = result.errorMessage
        }
      } else {
        this.successMessage = 'Vote created successfully!'
        this.voteForm.markAsPristine()
        this.voteForm.controls['id'].setValue(this.createVoteId())
      }
    } catch (error) {
      this.hasError = true
      this.errorMessage = 'An unexpected error occurred.'
      console.error('Unexpected error:', error)
    } finally {
      this.isLoading = false
    }
  }

  public errorAction(): void {
    this.hasError = false
    this.voteForm.controls['id'].setValue(this.createVoteId())
    this.errorMessage = ''
    this.successMessage = ''
  }

  public canDeactivate(): boolean {
    return !this.voteForm.dirty || this.confirmReloadService.confirmReload()
  }

  private beforeUnloadHandler = (event: BeforeUnloadEvent) => {
    if (this.voteForm.dirty) {
      event.preventDefault()
      event.returnValue = ''
    }
  }

  private createOption(): FormGroup {
    return this.fb.group({
      option: ['', Validators.required],
    })
  }

  private createVoteId(): string {
    return uuidv4()
  }
}
