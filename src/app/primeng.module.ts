import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [],
  imports: [],
  exports: [
    TableModule,
    ButtonModule,
    DialogModule,
    MenubarModule,
    ToolbarModule,
    InputTextModule,
    PaginatorModule,
    DropdownModule,
  ],
})
export class PrimengModule {}
