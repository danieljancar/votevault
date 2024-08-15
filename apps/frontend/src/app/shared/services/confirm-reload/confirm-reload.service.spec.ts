import { ConfirmReloadService } from './confirm-reload.service'
import { TestBed } from '@angular/core/testing'

describe('ConfirmReloadService', () => {
  let service: ConfirmReloadService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmReloadService],
    })
    service = TestBed.inject(ConfirmReloadService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('confirmReload', () => {
    it('should return the result of the confirm dialog', () => {
      const message =
        'You have unsaved changes. Are you sure you want to leave this page?'
      const spy = jest.spyOn(window, 'confirm').mockReturnValue(true)

      const result = service.confirmReload(message)

      expect(spy).toHaveBeenCalledWith(message)
      expect(result).toBe(true)
    })
  })
})
