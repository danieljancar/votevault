import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { CastComponent } from './cast.component'
import { VoteConfigService } from '../../../core/vote-transaction.service'
import { CastVoteService } from '../../../core/stellar/castVote.service'
import { ConfirmReloadService } from '../../../shared/services/confirm-reload/confirm-reload.service'
import { GetVoteOptionService } from '../../../core/stellar/getVoteOption.service'
import { LoadingComponent } from '../../../shared/feedback/loading/loading.component'
import { ErrorComponent } from '../../../shared/feedback/error/error.component'

describe('CastComponent', () => {
  let component: CastComponent
  let fixture: ComponentFixture<CastComponent>
  let voteConfigService: VoteConfigService
  let router: Router
  let confirmReloadService: ConfirmReloadService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CastComponent,
        LoadingComponent,
        ErrorComponent,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: VoteConfigService,
          useValue: {
            getBaseVoteConfig: jest.fn(),
          },
        },
        {
          provide: CastVoteService,
          useValue: {
            castVote: jest.fn(),
          },
        },
        {
          provide: ConfirmReloadService,
          useValue: {
            confirmReload: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: GetVoteOptionService,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(CastComponent)
    component = fixture.componentInstance
    voteConfigService = TestBed.inject(VoteConfigService)
    router = TestBed.inject(Router)
    confirmReloadService = TestBed.inject(ConfirmReloadService)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize the form with required fields', () => {
    expect(component.voteForm.contains('selectedOption')).toBeTruthy()
    expect(component.voteForm.get('selectedOption')?.valid).toBeFalsy()
  })

  it('should handle input changes and remove duplicates', async () => {
    const options = ['Option1', 'Option2', 'Option1']
    const data = ['Data1', 'Data2', 'Data1']

    component.optionsArr = options
    component.dataArr = data
    await component.ngOnChanges({
      optionsArr: {
        currentValue: options,
        previousValue: [],
        firstChange: true,
        isFirstChange(): boolean {
          return true
        },
      },
      dataArr: {
        currentValue: data,
        previousValue: [],
        firstChange: true,
        isFirstChange(): boolean {
          return true
        },
      },
    })

    expect(component.optionsArr).toEqual(['Option1', 'Option2'])
    expect(component.dataArr).toEqual(['Data1', 'Data2'])
  })

  it('should handle errors when fetching vote configuration', async () => {
    jest
      .spyOn(voteConfigService, 'getBaseVoteConfig')
      .mockRejectedValueOnce(new Error('Fetch error'))

    await component.ngOnChanges({})

    expect(component.hasError).toBeTruthy()
    expect(component.errorMessage).toBe('Failed to load vote configuration.')
  })

  it('should navigate to results view if form is clean', () => {
    component.voteId = '123'
    component.viewResults()

    expect(router.navigate).toHaveBeenCalledWith(['/voting/r', '123'])
  })

  it('should not navigate to results view if form is dirty and confirm is false', () => {
    jest.spyOn(confirmReloadService, 'confirmReload').mockReturnValueOnce(false)
    component.voteForm.markAsDirty()
    component.voteId = '123'
    component.viewResults()

    expect(router.navigate).not.toHaveBeenCalled()
  })

  it('should reset error state on errorAction call', () => {
    component.hasError = true
    component.errorMessage = 'Some error'
    component.errorAction()

    expect(component.hasError).toBeFalsy()
    expect(component.errorMessage).toBe('')
  })
})
