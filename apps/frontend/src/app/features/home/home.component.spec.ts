import { ComponentFixture, inject, TestBed } from '@angular/core/testing'
import { HomeComponent } from './home.component'
import { Router } from '@angular/router'

describe('HomeComponent', () => {
  let component: HomeComponent
  let fixture: ComponentFixture<HomeComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(HomeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  test('should search vote', inject([Router], (mockRouter: Router) => {
    const spyRouter = spyOn(mockRouter, 'navigate').and.stub()

    component.voteId.setValue('123')
    component.searchVote()
    expect(spyRouter.calls.first().args[0]).toContain('voting' && '123')
  }))
})
