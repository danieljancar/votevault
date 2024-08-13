import { Component } from '@angular/core'
import { CookieService } from 'ngx-cookie-service'
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './disclaimer.component.html',
  styleUrl: './disclaimer.component.css',
})
export class DisclaimerComponent {
  constructor(private cookieService: CookieService) {}
  acceptCookies() {
    this.cookieService.set('disclaimer', 'accepted', 365)
  }

  hasAcceptedCookies() {
    return this.cookieService.check('disclaimer')
  }
}
