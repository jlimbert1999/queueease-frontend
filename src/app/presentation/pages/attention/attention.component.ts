import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';
import { BranchService, ConfigService } from '../../services';
import { menuResponse } from '../../../infrastructure/interfaces';
import { CustomerService } from '../../services/customer/customer.service';
import { GridButtonsComponent } from '../../components/grid-buttons/grid-buttons.component';

interface menu {
  name: string;
  category?: string;
}
@Component({
  selector: 'app-attention',
  standalone: true,
  imports: [CommonModule, PrimengModule, GridButtonsComponent],
  templateUrl: './attention.component.html',
  styleUrl: './attention.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionComponent implements OnInit {
  private customerService = inject(CustomerService);
  private configService = inject(ConfigService);
  private messageService = inject(MessageService);

  private readonly branch = this.configService.branch;

  index = signal(0);
  prevIndex = signal<number>(0);
  menu = signal<menuResponse[]>([]);
  selectedItem = signal<number | null>(null);
  submenu = signal<any[]>([]);

  constructor() {}

  ngOnInit() {
    this.setMenu();
  }

  setMenu() {
    if (!this.branch) {
      this.messageService.add({
        severity: 'error',
        summary: 'Sin configuracion',
        detail: 'No se configuro la sucursal',
        life: 5000,
      });
    }
    this.customerService.getMenu(this.branch!).subscribe((data) => {
      this.menu.set(data);
      console.log(data);
    });
  }

  handleClick(item: menuResponse) {
    if (item.value) {
      this.index.set(2);
      this.prevIndex.set(0);
    } else {
      this.index.set(1);
      this.prevIndex.set(0);
      this.submenu.set(item.services);
    }
  }

  setFinal() {
    this.index.set(2);
  }
}
