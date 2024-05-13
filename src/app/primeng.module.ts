import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { PickListModule } from 'primeng/picklist';
import { DragDropModule } from 'primeng/dragdrop';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { DockModule } from 'primeng/dock';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { StepperModule } from 'primeng/stepper';
import { PasswordModule } from 'primeng/password';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
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
    PickListModule,
    DragDropModule,
    InputNumberModule,
    InputMaskModule,
    ListboxModule,
    MultiSelectModule,
    DockModule,
    CardModule,
    RippleModule,
    StepperModule,
    PasswordModule,
    IconFieldModule,
    InputIconModule,
    ToastModule
  ],
})
export class PrimengModule {}
