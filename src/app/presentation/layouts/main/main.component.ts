import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { PrimengModule } from '../../../primeng.module';
import { map, shareReplay } from 'rxjs';
import { LoaderComponent, AppbarComponent } from '../../components';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    RouterModule,
    PrimengModule,
    SidebarModule,
    AppbarComponent,
    SidebarComponent,
    LoaderComponent,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private breakpointObserver = inject(BreakpointObserver);
  visibleSidebar: boolean = true;

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );
}
