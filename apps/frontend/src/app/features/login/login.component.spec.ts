import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LoginComponent } from './login.component'
import { AuthService } from '../../core/auth.service'
import { ChangeDetectorRef } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>
  let authService: AuthService

  beforeEach(async () => {
    const mockAuthService = {
      loginUsingPrivateKey: jest.fn().mockResolvedValue(true),
    }
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: {} },
        ChangeDetectorRef,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    authService = TestBed.inject(AuthService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should call loginUsingPrivateKey on authService', async () => {
    await component.logInUsingPrivateKey()
    expect(authService.loginUsingPrivateKey).toHaveBeenCalled()
  })
})
