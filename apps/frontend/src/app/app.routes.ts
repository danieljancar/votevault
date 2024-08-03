import { Route } from '@angular/router'
import { HomeComponent } from './features/home/home.component'
import { AboutComponent } from './features/about/about.component'
import { LoginComponent } from './features/login/login.component'
import { RegisterComponent } from './features/register/register.component'
import { AuthGuard } from './guards/auth.guard'
import { CastComponent } from './features/voting/cast/cast.component'
import { ResultsComponent } from './features/voting/results/results.component'
import { VotingComponent } from './features/voting/voting.component'

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutComponent,
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
    path: 'voting',
    children: [
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
      {
        path: ':id',
        component: VotingComponent,
      },
    ],
  },
  {
    path: 'about',
    redirectTo: '',
  },
]
