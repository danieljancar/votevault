import { ComponentFixture, TestBed } from '@angular/core/testing'
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

  test('searchVote', () => {
    const router = TestBed.inject(Router)
    const navigateSpy = jest.spyOn(router, 'navigate')
    component.voteId.setValue('123')
    component.searchVote()
    expect(navigateSpy).toHaveBeenCalledWith(['/voting', '123'])
  })

  test('createVote', () => {
    const router = TestBed.inject(Router)
    const navigateSpy = jest.spyOn(router, 'navigate')
    component.createVote()
    expect(navigateSpy).toHaveBeenCalledWith(['/voting', 'create'])
  })

  test('pasteVoteId', async () => {
    const clipboard = {
      readText: jest.fn().mockResolvedValue('123'),
    }
    Object.defineProperty(navigator, 'clipboard', {
      value: clipboard,
    })
    await component.pasteVoteId()
    expect(component.voteId.value).toBe('123')
  })
})
