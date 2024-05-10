import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PrimengModule } from '../../../primeng.module';
import { BranchService } from '../../services';

interface menu {
  name: string;
  category?: string;
}
@Component({
  selector: 'app-attention',
  standalone: true,
  imports: [CommonModule, PrimengModule],
  templateUrl: './attention.component.html',
  styleUrl: './attention.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttentionComponent implements OnInit {
  private branchService = inject(BranchService);
  index = signal(0);

  items: MenuItem[] | undefined;

    position: string = 'bottom';

    positionOptions = [
        {
            label: 'Bottom',
            value: 'bottom'
        },
        {
            label: 'Top',
            value: 'top'
        },
        {
            label: 'Left',
            value: 'left'
        },
        {
            label: 'Right',
            value: 'right'
        }
    ];
  
  ngOnInit() {
    this.branchService.getMenu(1).subscribe((data) => {
      console.log(data);
    });
    this.items = [
      {
          label: 'Finder',
          icon: 'https://primefaces.org/cdn/primeng/images/dock/finder.svg',
          command:()=>{
            console.log('ds');
          }
      },
      {
          label: 'App Store',
          icon: 'https://primefaces.org/cdn/primeng/images/dock/appstore.svg'
      },
      {
          label: 'Photos',
          icon: 'https://primefaces.org/cdn/primeng/images/dock/photos.svg'
      },
      {
          label: 'Trash',
          icon: 'https://primefaces.org/cdn/primeng/images/dock/trash.png'
      }
  ];
  }

  setFinal() {
    this.index.set(2);
  }
}
