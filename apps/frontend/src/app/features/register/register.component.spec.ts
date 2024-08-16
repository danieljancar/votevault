import { ComponentFixture, TestBed } from '@angular/core/testing'
import { RegisterComponent } from './register.component'
import { AuthService } from '../../core/auth.service'
import { ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

describe('RegisterComponent', () => {
  let component: RegisterComponent
  let fixture: ComponentFixture<RegisterComponent>
  let authService: AuthService

  beforeEach(async () => {
    const mockAuthService = {
      generateKeypair: jest.fn().mockReturnValue({
        publicKey: jest.fn().mockReturnValue('publicKey'),
        secret: jest.fn().mockReturnValue,
      }),
      fundAccount: jest.fn().mockResolvedValue(true),
    }

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: {} },
        ChangeDetectorRef,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(RegisterComponent)
    component = fixture.componentInstance
    authService = TestBed.inject(AuthService)
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should generate keypair', () => {
    component.generateKeypair()
    expect(authService.generateKeypair).toHaveBeenCalled()
  })
})
