import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { PrimengModule } from '../../../primeng.module';
import { LayoutService } from '../../services/app.layout.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, tap } from 'rxjs';
import { ToolbarComponent } from '../../components';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-administration',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterModule,
    PrimengModule,
    SidebarModule,
    ToolbarComponent,
    SidebarComponent
  ],
  templateUrl: './administration.component.html',
  styleUrl: './administration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationComponent {
  private breakpointObserver = inject(BreakpointObserver);

  private layoutService = inject(LayoutService);
  visibleSidebar: boolean = true;

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  items: MenuItem[] = [
    {
      label: 'Administracion',
      icon: 'pi pi-fw pi-box',
      items: [],
    },
    {
      icon: 'pi pi-th-large',
      label: 'Categorisssas',
      routerLink: 'categories',
    },
    {
      icon: 'pi pi-list-check',
      label: 'Servicios',
      routerLink: 'services',
    },
    {
      icon: 'pi pi-warehouse',
      label: 'Sucursales',
      routerLink: 'branches',
    },
    {
      icon: 'pi pi-shop',
      label: 'Ventanillas',
      routerLink: 'counters',
    },
    {
      icon: 'pi pi-users',
      label: 'Usuarios',
      routerLink: 'users',
    },
  ];

  get containerClass() {
    return {
      'layout-theme-light': this.layoutService.config().colorScheme === 'light',
      'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
      'layout-overlay': this.layoutService.config().menuMode === 'overlay',
      'layout-static': this.layoutService.config().menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config().menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
      'p-input-filled': this.layoutService.config().inputStyle === 'filled',
      'p-ripple-disabled': !this.layoutService.config().ripple,
    };
  }
}
