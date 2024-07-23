import { Route } from '@angular/router'
import { HomeComponent } from './features/home/home.component'
import { AboutComponent } from './features/about/about.component'
import { LoginComponent } from './features/login/login.component'
import { RegisterComponent } from './features/register/register.component'
import { AuthGuard } from './guards/auth.guard'

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
]
