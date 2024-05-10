import { Routes } from '@angular/router';
import { AdministrationComponent } from './presentation/pages';
import { AppComponent } from './app.component';
import { ServiceDesksComponent } from './presentation/pages/administration/service_desks/service_desks.component';
import { CategoriesComponent } from './presentation/pages/administration/categories/categories.component';
import { ServicesComponent } from './presentation/pages/administration/services/services.component';
import { BranchesComponent } from './presentation/pages/administration/branches/branches.component';
import { AttentionComponent } from './presentation/pages/attention/attention.component';
import { InformationComponent } from './presentation/layouts/information/information.component';
import { MainComponent } from './presentation/pages/main/main.component';

export const routes: Routes = [
  // {
  //   path: '',
  //   component: AppComponent,
  //   children: [],
  // },
  {
    path: 'administration',
    component: AdministrationComponent,
    children: [
      { path: 'categories', component: CategoriesComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'branches', component: BranchesComponent },
      { path: 'desks', component: ServiceDesksComponent },
    ],
  },
  {
    path: 'attention',
    component: AttentionComponent,
  },
  {
    path: 'information',
    component: InformationComponent,
  },
  {
    path: 'main',
    component: MainComponent,
  },
  { path: '', redirectTo: 'administration', pathMatch: 'full' },
];
