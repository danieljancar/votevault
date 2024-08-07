import { Route } from '@angular/router'
import { HomeComponent } from './features/home/home.component'
import { AboutComponent } from './features/about/about.component'
import { LoginComponent } from './features/login/login.component'
import { RegisterComponent } from './features/register/register.component'
import { VotingComponent } from './features/voting/voting.component'
import { CreateComponent } from './features/voting/create/create.component'
import { ResultsComponent } from './features/voting/results/results.component'
import { UnsavedChangesGuard } from './guards/unsaved-changes.guard' // Adjust path as needed

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'about',
    component: AboutComponent,
    // canActivate: [AuthGuard],
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
    // canActivate: [AuthGuard],
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
        path: 'results/:id',
        component: ResultsComponent,
      },
      {
        path: ':id',
        component: VotingComponent,
        canDeactivate: [UnsavedChangesGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
]
