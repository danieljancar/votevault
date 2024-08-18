import { ComponentFixture, TestBed } from '@angular/core/testing'
import { NewsBannerComponent } from './news-banner.component'

describe('NewsBannerComponent', () => {
  let component: NewsBannerComponent
  let fixture: ComponentFixture<NewsBannerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsBannerComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(NewsBannerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
