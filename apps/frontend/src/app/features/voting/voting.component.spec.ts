import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { ActivatedRoute } from '@angular/router'
import { of } from 'rxjs' // Import this if you want to mock Observables

import { VotingComponent } from './voting.component'
import { VoteConfigService } from '../../core/vote-transaction.service'
import { AuthService } from '../../core/auth.service'
import { HttpClient } from '@angular/common/http'

describe('VotingComponent', () => {
  let component: VotingComponent
  let fixture: ComponentFixture<VotingComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VotingComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => 'someValue' }),
          },
        },
        {
          provide: VoteConfigService,
          useValue: {
            getBaseVoteConfig: () => Promise.resolve({ server: 'someServer' }),
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
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(VotingComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should call ngOnInit', () => {
    jest.spyOn(component, 'ngOnInit')
    component.ngOnInit()
    expect(component.ngOnInit).toHaveBeenCalled()
  })

  it('should call ngOnDestroy', () => {
    jest.spyOn(component, 'ngOnDestroy')
    component.ngOnDestroy()
    expect(component.ngOnDestroy).toHaveBeenCalled()
  })
})
