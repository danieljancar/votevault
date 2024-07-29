import { Route } from '@angular/router'
import { HomeComponent } from './features/home/home.component'
import { AboutComponent } from './features/about/about.component'
import { LoginComponent } from './features/login/login.component'
import { RegisterComponent } from './features/register/register.component'
import { AuthGuard } from './guards/auth.guard'
import { VotingComponent } from './features/voting/voting.component'
import { CastComponent } from './features/voting/cast/cast.component'

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
    path: 'voting',
    children: [
      {
        path: 'cast',
        children: [
          {
            path: '',
            redirectTo: '/',
            pathMatch: 'full',
          },
          {
            path: ':id',
            component: CastComponent,
          },
        ],
      },
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'about',
    redirectTo: '',
  },
]
