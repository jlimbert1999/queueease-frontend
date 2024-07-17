import { Routes } from '@angular/router';
import { MainComponent } from './presentation/pages';
import { CountersComponent } from './presentation/pages/administration/counters/counters.component';
import { CategoriesComponent } from './presentation/pages/administration/categories/categories.component';
import { ServicesComponent } from './presentation/pages/administration/services/services.component';
import { BranchesComponent } from './presentation/pages/administration/branches/branches.component';
import { AttentionComponent } from './presentation/pages/attention/attention.component';
import { DashboardComponent } from './presentation/pages/dashboard/dashboard.component';
import { LoginComponent } from './presentation/pages/auth/login/login.component';
import { isAuthenticatedGuard } from './presentation/guards/auth/is-authenticated.guard';
import { QueueManagementComponent } from './presentation/pages/queue-management/queue-management.component';
import { AnnouncementComponent } from './presentation/pages/announcement/announcement.component';
import { UsersComponent } from './presentation/pages/administration/users/users.component';
import { UnauthorizedComponent } from './presentation/pages/background/errors/unauthorized/unauthorized.component';

import {
  isNotAuthenticatedGuard,
  roleGuard,
  counterGuard,
  branchConfigGuard,
} from './presentation/guards';
import { BackgroundComponent } from './presentation/pages/background/background.component';
import { PreferencesComponent } from './presentation/pages/administration/preferences/preferences.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: 'login',
    title: 'Autenticacion',
    canActivate: [isNotAuthenticatedGuard],
    component: LoginComponent,
  },
  {
    path: 'main',
    title: 'Inicio',
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
          { path: 'preferences', component: PreferencesComponent },
        ],
      },
      {
        path: 'queue',
        title: 'Atencion',
        canActivate: [counterGuard],
        component: QueueManagementComponent,
      },
      { path: '', component: BackgroundComponent },
    ],
  },
  {
    path: 'attention',
    canActivate: [branchConfigGuard],
    children: [
      { path: '', redirectTo: 'services', pathMatch: 'full' },
      { path: 'advertisement', component: AnnouncementComponent },
      { path: 'services', component: AttentionComponent },
    ],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
