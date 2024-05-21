import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { PrimengModule } from '../../../primeng.module';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { BranchService, ConfigService } from '../../services';
import { Branch } from '../../../domain/models';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  private router = inject(Router);
  private branchService = inject(BranchService);
  private config = inject(ConfigService);

  branches = signal<Branch[]>([]);
  brach = model<number>();

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
    this.isConfigDialogVisible.set(true);
    this.branchService.findAll(20, 0).subscribe(({ branches }) => {
      this.branches.set(branches);
    });
  }

  save() {
    if (!this.brach()) return;
    this.config.setupBranch(this.brach()!);
  }
}
