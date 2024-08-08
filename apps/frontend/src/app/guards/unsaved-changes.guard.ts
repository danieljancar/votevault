import { Injectable } from '@angular/core'
import { CanDeactivate } from '@angular/router'
import { Observable } from 'rxjs'
import { CanComponentDeactivate } from '../types/can-deactivate.interfaces'
import { ConfirmReloadService } from '../shared/services/confirm-reload/confirm-reload.service'

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  constructor(private confirmReloadService: ConfirmReloadService) {}

  canDeactivate(
    component: CanComponentDeactivate,
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (component.canDeactivate && !component.canDeactivate()) {
      return this.confirmReloadService.confirmReload()
    }
    return true
  }
}
