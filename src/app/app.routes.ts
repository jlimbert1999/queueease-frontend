import { Routes } from '@angular/router';
import { MainComponent } from './presentation/pages';
import { CountersComponent } from './presentation/pages/administration/counters/counters.component';
import { CategoriesComponent } from './presentation/pages/administration/categories/categories.component';
import { ServicesComponent } from './presentation/pages/administration/services/services.component';
import { BranchesComponent } from './presentation/pages/administration/branches/branches.component';
import { AttentionComponent } from './presentation/pages/attention/attention.component';
import { InformationComponent } from './presentation/layouts/information/information.component';
import { DashboardComponent } from './presentation/pages/dashboard/dashboard.component';
import { LoginComponent } from './presentation/pages/auth/login/login.component';
import { isAuthenticatedGuard } from './presentation/guards/auth/is-authenticated.guard';
import { QueueManagementComponent } from './presentation/pages/queue-management/queue-management.component';
import { AnnouncementComponent } from './presentation/pages/announcement/announcement.component';
import { UsersComponent } from './presentation/pages/administration/users/users.component';
import { UnauthorizedComponent } from './presentation/pages/errors/unauthorized/unauthorized.component';

import {
  isNotAuthenticatedGuard,
  roleGuard,
  counterGuard,
  branchConfigGuard,
} from './presentation/guards';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'login',
    canActivate: [isNotAuthenticatedGuard],
    component: LoginComponent,
  },
  {
    path: 'main',
    canActivate: [isAuthenticatedGuard],
    component: MainComponent,
    children: [
      {
        path: 'administration',
        data: { role: 'admin' },
        canActivate: [roleGuard],
        children: [
          { path: '', redirectTo: 'users', pathMatch: 'full' },
          { path: 'categories', component: CategoriesComponent },
          { path: 'services', component: ServicesComponent },
          { path: 'branches', component: BranchesComponent },
          { path: 'counters', component: CountersComponent },
          { path: 'users', component: UsersComponent },
        ],
      },
      {
        path: 'queue',
        canActivate: [counterGuard],
        component: QueueManagementComponent,
      },
    ],
  },
  {
    path: 'attention',
    canActivate: [branchConfigGuard],
    component: AttentionComponent,
  },
  {
    path: 'advertisement',
    canActivate: [branchConfigGuard],
    component: AnnouncementComponent,
  },

  {
    path: 'information',
    component: InformationComponent,
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
