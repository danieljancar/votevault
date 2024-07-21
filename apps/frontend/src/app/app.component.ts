import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { NavbarComponent } from './shared/navbar/navbar.component'

@Component({
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
