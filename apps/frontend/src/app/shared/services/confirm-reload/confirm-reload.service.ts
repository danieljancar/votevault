import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ConfirmReloadService {
  public confirmReload(
    message = 'You have unsaved changes. Are you sure you want to leave this page?',
  ): boolean {
    return confirm(message)
  }
}
