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
      label: 'Finder',
      tooltipOptions: {
        tooltipLabel: 'Administracion',
        tooltipPosition: 'top',
        positionTop: -15,
        positionLeft: 15,
        showDelay: 1000,
      },
      icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg',
      command: () => {
        this.router.navigate(['administration']);
      },
    },
    {
      label: 'Terminal',
      tooltipOptions: {
        tooltipLabel: 'Configuraciones',
        tooltipPosition: 'top',
        positionTop: -15,
        positionLeft: 15,
        showDelay: 1000,
      },
      icon: 'https://primefaces.org/cdn/primeng/images/dock/terminal.svg',
      command: () => {
        this.setupConfig();
      },
    },
    {
      label: 'Panel',
      tooltipOptions: {
        tooltipLabel: 'Configuraciones',
        tooltipPosition: 'top',
        positionTop: -15,
        positionLeft: 15,
        showDelay: 1000,
      },
      icon: 'https://primefaces.org/cdn/primeng/images/dock/terminal.svg',
      command: () => {},
    },
  ];

  menubarItems = [
    {
      label: 'Finder',
      styleClass: 'menubar-root',
    },
  ];

  setupConfig() {
    this.brach.set(this.config.branch());
    this.isConfigDialogVisible.set(true);
    this.branchService.findAll(20, 0).subscribe(({ branches }) => {
      console.log(branches);
      this.branches.set(branches);
    });
  }

  setBranch() {
    this.config.setBranch(this.brach()!);
  }
}
