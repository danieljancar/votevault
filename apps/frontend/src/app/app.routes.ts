import { Route } from '@angular/router'
import { HomeComponent } from './features/home/home.component'
import { AboutComponent } from './features/about/about.component'
import { LoginComponent } from './features/login/login.component'
import { RegisterComponent } from './features/register/register.component'
import { VotingComponent } from './features/voting/voting.component'
import { CreateComponent } from './features/voting/create/create.component'
import { AuthGuard } from './guards/auth.guard'
import { NotAuthGuard } from './guards/not-auth.guard'
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard'
import { ResultsComponent } from './features/voting/results/results.component'
import { PolicyComponent } from './shared/cookie/policy/policy.component'

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [NotAuthGuard],
  },
  {
    path: 'voting',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/',
        pathMatch: 'full',
      },
      {
        path: 'create',
        component: CreateComponent,
        canDeactivate: [UnsavedChangesGuard],
      },
      {
        path: 'r/:id',
        component: ResultsComponent,
      },
      {
        path: ':id',
        component: VotingComponent,
      },
    ],
  },
  {
    path: 'cookie-policy',
    component: PolicyComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
]
