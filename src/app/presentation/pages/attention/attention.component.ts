import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
import { GridOptionsComponent } from '../../components/grid-options/grid-options.component';
import { filter, switchMap, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface menu {
  name: string;
  category?: string;
}
@Component({
  selector: 'app-attention',
  standalone: true,
  imports: [CommonModule, PrimengModule, GridOptionsComponent],
  templateUrl: './attention.component.html',
  styleUrl: './attention.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionComponent implements OnInit {
  private customerService = inject(CustomerService);
  private configService = inject(ConfigService);
  private messageService = inject(MessageService);
  private pdfService = inject(PdfService);
  private destroyRef = inject(DestroyRef);

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

  // selectedService = signal<number | null>(null);
  menu = signal<menuResponse[]>([{ name: '', services: [] }]);

  currentMenuOption = computed(() => {
    const index = this.menu().length;
    return this.menu()[index - 1];
  });

  mainOptions: menuResponse[] = [
    
  ];

  currentOptions: menuResponse[] = [...this.mainOptions];
  parentStack: menuResponse[] = [];

  selectedService: menuResponse | null = null;

  constructor() {}

  ngOnInit() {
    this._setupMenu();
  }

  private _setupMenu() {
    this.configService.branch$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((id) => this.customerService.getMenu(id!))
      )
      .subscribe((resp) => {
        this.mainOptions = [...resp];
        this.currentOptions = [...this.mainOptions];
        console.log(this.currentOptions);
        // this.menu.set([{ name: 'Home', services: resp }]);
      });
  }

  selectItem(item: menuResponse) {
    // if (item.value) return this.selectedService.set(item.value);
    // if (item.services.length === 0) return;
    this.menu.update((values) => [...values, item]);
  }

  // goBack() {
  //   // if (this.selectedService()) {
  //   //   return this.selectedService.set(null);
  //   // }
  //   // if (this.menu().length === 1) return;
  //   // this.menu.update((val) => {
  //   //   val.pop();
  //   //   return [...val];
  //   // });
  // }

  selectOption(option: menuResponse) {
    if (option.value) {
      this.selectedService = option;
    } else {
      this.parentStack.push({ name: 'Back', services: this.currentOptions });
      this.currentOptions = option.services;
      this.selectedService = null;
    }
  }

  goBack() {
    if (this.selectedService) {
      this.selectedService = null;
    } else if (this.parentStack.length > 0) {
      const previous = this.parentStack.pop();
      if (previous) {
        this.currentOptions = previous.services;
      }
    } else {
      this.currentOptions = [...this.mainOptions];
    }
  }
}
