import { TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'
import { RouterModule } from '@angular/router'
import { AuthService } from './core/auth.service'
import { HttpClient } from '@angular/common/http'

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],
      providers: [
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
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })
})
