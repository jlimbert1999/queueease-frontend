import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { brachResponse } from '../../../infrastructure/interfaces';
import { DropdownComponent, SelectOption } from '../../components';
import { ConfigService, CustomerService } from '../../services';
import { PrimengModule } from '../../../primeng.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, DropdownComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private router = inject(Router);
  private configService = inject(ConfigService);
  private customerService = inject(CustomerService);

  branches = signal<SelectOption<brachResponse>[]>([]);
  currentBranch = signal<brachResponse | null>(null);
  isConfigDialogVisible = signal<boolean>(false);

  dockItems: MenuItem[] = [
    {
      label: 'Settings',
      tooltipOptions: {
        tooltipLabel: 'Configuraciones',
        tooltipPosition: 'top',
        positionTop: -15,
        positionLeft: 15,
        showDelay: 1000,
      },
      icon: '../../../../assets/img/apps/cogwheel.png',
      command: () => {
        this.setupConfig();
      },
    },
    {
      label: 'Administration',
      tooltipOptions: {
        tooltipLabel: 'Administracion',
        tooltipPosition: 'top',
        positionTop: -15,
        positionLeft: 15,
        showDelay: 1000,
      },
      icon: '../../../../assets/img/apps/user-gear.png',
      command: () => {
        this.router.navigate(['login']);
      },
    },
    {
      label: 'Attention',
      tooltipOptions: {
        tooltipLabel: 'Atencion',
        tooltipPosition: 'top',
        positionTop: -15,
        positionLeft: 15,
        showDelay: 1000,
      },
      icon: '../../../../assets/img/apps/choice.png',
      command: () => this.router.navigate(['attention']),
    },
    {
      label: 'Publicity',
      tooltipOptions: {
        tooltipLabel: 'Anuncios',
        tooltipPosition: 'top',
        positionTop: -15,
        positionLeft: 15,
        showDelay: 1000,
      },
      icon: '../../../../assets/img/apps/web-advertising.png',
      command: () => this.router.navigate(['advertisement']),
    },
  ];

  setupConfig() {
    const branch = this.configService.branch();
    if (branch) {
      this.branches.set([{ value: branch, label: branch.name }]);
      this.currentBranch.set(branch);
    }
    this.isConfigDialogVisible.set(true);
  }

  searchBranches(value: string) {
    this.customerService.searchBranches(value).subscribe((branches) => {
      this.branches.set(branches.map((el) => ({ value: el, label: el.name })));
    });
  }

  selectBranch(branch: brachResponse | null) {
    this.configService.updateBranch(branch!);
  }
}
