import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { brachResponse } from '../../../infrastructure/interfaces';
import { DropdownComponent, SelectOption } from '../../components';
import { CustomerService } from '../../services';
import { PrimengModule } from '../../../primeng.module';

interface branch {
  id: string;
  name: string;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PrimengModule, DropdownComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private router = inject(Router);
  private customerService = inject(CustomerService);

  branches = signal<SelectOption<branch>[]>([]);
  branch = signal<branch | null>(null);
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
        this._loadConfig();
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
      command: () => this.router.navigate(['attention/services']),
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
      command: () => this.router.navigate(['attention/advertisement']),
    },
  ];

  searchBranches(value: string) {
    this.customerService.searchBranches(value).subscribe((branches) => {
      this.branches.set(
        branches.map(({ id, name }) => ({ value: { id, name }, label: name }))
      );
    });
  }

  selectBranch(branch: branch | null) {
    this.branch.set(branch ? { id: branch.id, name: branch.name } : null);
  }

  save() {
    this.customerService.setBranch(this.branch());
    this.isConfigDialogVisible.set(false);
  }

  cancel() {
    this.isConfigDialogVisible.set(false);
  }

  private _loadConfig() {
    const savedBranch = this.customerService.checkSavedBranch();
    this.branch.set(savedBranch);
    this.branches.set([
      ...(savedBranch ? [{ value: savedBranch, label: savedBranch.name }] : []),
    ]);
    this.isConfigDialogVisible.set(true);
  }
}
