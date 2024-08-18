import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CookieService } from 'ngx-cookie-service'

@Component({
  selector: 'app-news-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-banner.component.html',
  styleUrl: './news-banner.component.css',
})
export class NewsBannerComponent implements OnInit {
  protected isDismissed = false

  constructor(private cookieService: CookieService) {}

  ngOnInit() {
    this.isDismissed = this.cookieService.check('news-banner')
  }

  dismiss() {
    this.cookieService.set('news-banner', 'dismissed', 1)
    this.isDismissed = true
  }
}
