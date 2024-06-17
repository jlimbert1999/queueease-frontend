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
import { AuthService } from '../../services';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterModule,
    PrimengModule,
    SidebarModule,
    ToolbarComponent,
    SidebarComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private breakpointObserver = inject(BreakpointObserver);

  private layoutService = inject(LayoutService);
  visibleSidebar: boolean = true;

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

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
