import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NavbarComponent } from './shared/navigation/navbar/navbar.component'
import { DisclaimerComponent } from './shared/navigation/disclaimer/disclaimer.component'

@Component({
  standalone: true,
  imports: [RouterModule, NavbarComponent, DisclaimerComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
