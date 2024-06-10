import { Routes } from '@angular/router';
import { AdministrationComponent } from './presentation/pages';
import { AppComponent } from './app.component';
import { CountersComponent } from './presentation/pages/administration/counters/counters.component';
import { CategoriesComponent } from './presentation/pages/administration/categories/categories.component';
import { ServicesComponent } from './presentation/pages/administration/services/services.component';
import { BranchesComponent } from './presentation/pages/administration/branches/branches.component';
import { AttentionComponent } from './presentation/pages/attention/attention.component';
import { InformationComponent } from './presentation/layouts/information/information.component';
import { MainComponent } from './presentation/pages/main/main.component';
import { LoginComponent } from './presentation/pages/auth/login/login.component';
import { isAuthenticatedGuard } from './presentation/guards/is-authenticated.guard';
import { QueueManagementComponent } from './presentation/pages/queue-management/queue-management.component';
import { AnnouncementComponent } from './presentation/pages/announcement/announcement.component';
import { branchConfigGuard } from './presentation/guards/branch-config.guard';
import { HomeComponent } from './presentation/layouts/home/home.component';
import { isNotAuthenticatedGuard } from './presentation/guards';
import { UsersComponent } from './presentation/pages/administration/users/users.component';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [isNotAuthenticatedGuard],
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [isAuthenticatedGuard],
    component: HomeComponent,
  },
  {
    path: 'administration',
    canActivate: [isAuthenticatedGuard],
    component: AdministrationComponent,
    children: [
      { path: 'categories', component: CategoriesComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'branches', component: BranchesComponent },
      { path: 'counters', component: CountersComponent },
      { path: 'users', component: UsersComponent },
    ],
  },

  {
    path: 'attention',
    canActivate: [branchConfigGuard],
    component: AttentionComponent,
  },
  {
    path: 'information',
    component: InformationComponent,
  },
  {
    path: 'queue',
    canActivate: [isAuthenticatedGuard],
    component: QueueManagementComponent,
  },
  {
    path: 'advertisement',
    canActivate: [branchConfigGuard],
    component: AnnouncementComponent,
  },
  {
    path: 'main',
    component: MainComponent,
  },
  { path: '', redirectTo: 'main', pathMatch: 'full' },
];
