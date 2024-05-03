import { Routes } from '@angular/router';
import { AdministrationComponent } from './presentation/pages';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './presentation/pages/administration/categories/categories.component';
import { ServicesComponent } from './presentation/pages/administration/services/services.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'administration',
        component: AdministrationComponent,
        children: [
          { path: 'categories', component: CategoriesComponent },
          { path: 'services', component: ServicesComponent },
        ],
      },
      { path: '', redirectTo: 'administration', pathMatch: 'full' },
    ],
  },
];
