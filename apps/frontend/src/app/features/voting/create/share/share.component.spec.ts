import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ShareComponent } from './share.component'

describe('ShareComponent', () => {
  let component: ShareComponent
  let fixture: ComponentFixture<ShareComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ShareComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  beforeAll(() => {
    Object.defineProperty(window.URL, 'createObjectURL', {
      writable: true,
      value: jest.fn(),
    })
    Object.defineProperty(window.URL, 'revokeObjectURL', {
      writable: true,
      value: jest.fn(),
    })
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should download vote ID', () => {
    const voteId = 'test-vote-id'
    const voteTitle = 'test-vote-title'

    component.voteId = voteId
    component.voteTitle = voteTitle

    const downloadVoteIDSpy = jest.spyOn(component, 'downloadVoteID')

    component.downloadVoteID()

    expect(downloadVoteIDSpy).toHaveBeenCalled()
  })
})
