import { Component, OnInit } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { NgClass } from '@angular/common'
import { TEST_ACCOUNT } from '../../../config/config'
import { Keypair } from '@stellar/typescript-wallet-sdk'
import { SorobanRpc } from '@stellar/stellar-sdk'
import { CreateVoteService } from '../../../core/stellar/createVote.service'
import { LoadingComponent } from '../../../shared/loading/loading.component'
import { ErrorComponent } from '../../../shared/error/error.component'
import { SuccessComponent } from '../../../shared/success/success.component'

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
export class CreateComponent implements OnInit {
  protected voteForm: FormGroup
  protected isLoading = false
  protected hasError = false
  protected errorMessage = ''
  protected successMessage = ''

  private sourceKeypair = Keypair.fromSecret(TEST_ACCOUNT)
  private server = new SorobanRpc.Server('https://soroban-testnet.stellar.org')

  constructor(
    private fb: FormBuilder,
    private createVoteService: CreateVoteService,
  ) {
    this.voteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      options: this.fb.array(
        [],
        [Validators.required, Validators.minLength(2), Validators.maxLength(5)],
      ),
    })
  }

  get options(): FormArray {
    return this.voteForm.get('options') as FormArray
  }

  ngOnInit(): void {
    this.addOption()
    this.addOption()
  }

  createOption(): FormGroup {
    return this.fb.group({
      option: ['', Validators.required],
    })
  }

  addOption(): void {
    if (this.options.length < 5) {
      this.options.push(this.createOption())
    }
  }

  removeOption(index: number): void {
    if (this.options.length > 2) {
      this.options.removeAt(index)
    }
  }

  async onSubmit(): Promise<void> {
    this.isLoading = true
    this.hasError = false
    this.errorMessage = ''
    this.successMessage = ''

    try {
      const result = await this.createVoteService.createVote(
        this.server,
        this.sourceKeypair,
        this.voteForm.value.title,
        this.voteForm.value.description,
        this.voteForm.value.options,
      )

      if (!result || result.hasError) {
        this.hasError = true
        if (result) {
          this.errorMessage = result.errorMessage
        }
      } else {
        this.successMessage = 'Vote created successfully!'
        this.addOption()
        this.addOption()
      }
    } catch (error) {
      this.hasError = true
      this.errorMessage = 'An unexpected error occurred.'
      console.error('Unexpected error:', error)
    } finally {
      this.isLoading = false
    }
  }

  errorAction = (): void => {
    this.hasError = false
    this.voteForm.reset()
    this.errorMessage = ''
    this.successMessage = ''
  }
}
