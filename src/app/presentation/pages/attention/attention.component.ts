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
import { BranchService, ConfigService, PdfService } from '../../services';
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
  private pdfService = inject(PdfService);

  private readonly branch = this.configService.branch;

  index = signal(0);
  prevIndex = signal<number>(0);
  menu = signal<menuResponse[]>([]);
  submenu = signal<menuResponse[]>([]);

  data: menuResponse[] = [
    {
      name: 'ARCHIVOS',
      services: [
        {
          value: 10,
          name: 'Servicio A',
          services: [],
        },
        {
          value: 11,
          name: 'Servicio B',
          services: [],
        },
      ],
    },
    {
      name: 'CAJA',
      services: [],
    },
    {
      name: 'RUAT',
      services: [
        {
          value: 1,
          name: 'VEHICULOS',
          services: [],
        },
        {
          value: 2,
          name: 'ACTIVIDADES ECONOMICAS',
          services: [],
        },
        {
          name: 'SUBNIVEL RUAT',
          services: [
            {
              value: 12,
              name: 'Servicio C',
              services: [],
            },
            {
              name: 'Servicio D',
              services: [
                {
                  name: 'neste serv',
                  services: [{ name: 'ds', services: [] }],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'CATASTRO',
      services: [
        {
          value: 3,
          name: 'INSCRIPCION CATRASTRAL',
          services: [],
        },
        {
          value: 5,
          name: 'VISACIONES',
          services: [],
        },
        {
          value: 6,
          name: 'EMPADRONAMIENTO',
          services: [],
        },
        {
          value: 7,
          name: 'DECLARACION JURADA',
          services: [],
        },
      ],
    },
    {
      value: 4,
      name: 'VENTANILLA UNICA',
      services: [],
    },
  ];
  selectedItems = signal<menuResponse[]>([]);
  sleectedService = signal<number | null>(null);
  currentOption = computed(() => {
    const length = this.selectedItems().length - 1;
    return this.selectedItems()[length];
  });

  constructor() {}

  ngOnInit() {
    // this.setMenu();
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

  setFinal() {
    this.index.set(2);
  }

  selectItem(item: menuResponse) {
    if (item.value) return this.confirmSelection(item);
    if (item.services.length === 0) return;
    this.selectedItems.update((values) => [...values, item]);
    console.log(item);
  }

  confirmSelection(item: menuResponse) {
    this.sleectedService.set(item.value!);
  }

  goBack() {
    if (this.sleectedService()) return this.sleectedService.set(null);
    this.selectedItems.update((val) => {
      val.pop();
      return val;
    });
  }

  handleClick(e: any) {}

  get lastIndex() {
    return this.selectedItems().length - 1;
  }
  print(){
    this.pdfService.generateTicket({name:'MI servic', code:'', date:'10/12/2024'})
  }
}
