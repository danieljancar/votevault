import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CreateComponent } from './create.component'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs'
import { VoteConfigService } from '../../../core/vote-transaction.service'
import { AuthService } from '../../../core/auth.service'
import { HttpClient } from '@angular/common/http'
import { CreateVoteService } from '../../../core/stellar/createVote.service'

describe('CreateComponent', () => {
  let component: CreateComponent
  let fixture: ComponentFixture<CreateComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'test-vote-id' }),
          },
        },
        {
          provide: VoteConfigService,
          useValue: {
            getBaseVoteConfig: jest.fn().mockResolvedValue({
              server: {},
              sourceKeypair: {},
            }),
          },
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: HttpClient,
          useValue: {},
        },
        {
          provide: CreateVoteService,
          useValue: {
            createVote: jest.fn().mockResolvedValue({
              status: 'SUCCESS',
            }),
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(CreateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should have a voteForm', () => {
    expect(component.voteForm).toBeTruthy()
  })

  it('should have isLoading set to false', () => {
    expect(component.isLoading).toBeFalsy()
  })

  it('should have hasError set to false', () => {
    expect(component.hasError).toBeFalsy()
  })

  it('should have errorMessage set to an empty string', () => {
    expect(component.errorMessage).toBe('')
  })

  it('should have successMessage set to an empty string', () => {
    expect(component.successMessage).toBe('')
  })

  it('should have options set to an array with 2 options', () => {
    expect(component.options.length).toBe(2)
  })

  it('should submit form', () => {
    component.voteForm.controls['id'].setValue('test-id')
    component.voteForm.controls['title'].setValue('test-title')
    component.voteForm.controls['description'].setValue('test-description')
    component.voteForm.controls['options'].setValue([
      { option: 'Option A' },
      { option: 'Option B' },
    ])

    component.onSubmit()

    expect(component.isLoading).toBeTruthy()
    expect(component.hasError).toBeFalsy()
    expect(component.errorMessage).toBe('')
    expect(component.successMessage).toBe('')
  })
})
