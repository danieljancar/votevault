import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NavbarComponent } from './shared/navigation/navbar/navbar.component'
import { DisclaimerComponent } from './shared/navigation/disclaimer/disclaimer.component'
import { FooterComponent } from './shared/navigation/footer/footer.component'
import { NewsBannerComponent } from './shared/navigation/banner/news-banner.component'

@Component({
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    DisclaimerComponent,
    FooterComponent,
    NewsBannerComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
