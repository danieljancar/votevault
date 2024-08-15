import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ResultsComponent } from './results.component'
import { ActivatedRoute } from '@angular/router'
import { VoteConfigService } from '../../../core/vote-transaction.service'
import { AuthService } from '../../../core/auth.service'
import { HttpClient } from '@angular/common/http'
import { GetVoteResultsService } from '../../../core/stellar/getVoteResults.service'
import { GetVoteService } from '../../../core/stellar/getVote.service'
import { CheckUserVotedService } from '../../../core/stellar/checkUserVoted.service'
import { of } from 'rxjs'

describe('ResultsComponent', () => {
  let component: ResultsComponent
  let fixture: ComponentFixture<ResultsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponent],
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
          provide: GetVoteResultsService,
          useValue: {
            getVoteResults: jest.fn().mockResolvedValue({
              dataArr: [
                { key: 'Option A', val: '10' },
                { key: 'Option B', val: '20' },
              ],
            }),
          },
        },
        {
          provide: GetVoteService,
          useValue: {
            getVote: jest.fn().mockResolvedValue({
              dataArr: ['Option A', 'Option B'],
            }),
          },
        },
        {
          provide: CheckUserVotedService,
          useValue: {
            checkIfUserHasVoted: jest.fn().mockResolvedValue({
              hasVoted: true,
            }),
          },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ResultsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize the component', () => {
    expect(component.isLoading).toBe(true)
    expect(component.hasError).toBe(false)
    expect(component.voteId).toBe('test-vote-id')
    expect(component.dataArr).toEqual([])
    expect(component.resultArr).toEqual([])
    expect(component.totalVotes).toBe(0)
  })

  it('should call ngOnInit', () => {
    component.ngOnInit()
    expect(component.isLoading).toBe(true)
    expect(component.hasError).toBe(false)
    expect(component.voteId).toBe('test-vote-id')
    expect(component.dataArr).toEqual([])
    expect(component.resultArr).toEqual([])
  })
})
