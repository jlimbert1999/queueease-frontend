import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  brachResponse,
  serviceResponse,
} from '../../../../../infrastructure/interfaces';
import { BranchService, ServiceService } from '../../../../services';
import { PrimengModule } from '../../../../../primeng.module';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { SecureUrlPipe } from '../../../../pipes/secure-url.pipe';
import { FactoryTarget } from '@angular/compiler';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    SecureUrlPipe,
  ],
  templateUrl: './branch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchComponent implements OnInit {
  private brachService = inject(BranchService);
  private serviceService = inject(ServiceService);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private branch?: brachResponse = inject(DynamicDialogConfig).data;

  private searchSubject$ = new Subject<string>();

  readonly maxFileSize = 1 * 1024 * 1024 * 2024;

  services = signal<serviceResponse[]>([]);
  selectedServices: serviceResponse[] = [];

  FormBranch: FormGroup = this.fb.group({
    name: ['', Validators.required],
    marqueeMessage: ['', Validators.required],
  });

  @ViewChild('fileUpload') fileUpload!: FileUpload;

  videos: File[] = [];

  previewVideos = signal<string[]>([]);

  constructor() {
    this._listenDropdowChange();
  }

  ngOnInit(): void {
    this._loadFormData();
  }

  save() {}

  onFilterDropdown(term: string) {
    if (!term) return;
    this.searchSubject$.next(term);
  }

  searchServices(term: string) {
    this.serviceService
      .searchAvailables(term)
      .subscribe((services) => this.services.set(services));
  }

  get isFormValid(): boolean {
    return true;
    // const isValidFile =
    //   this.platform === platforms.Local ? this.video != null : true;
    // return (
    //   this.FormBranch.valid && this.selectedServices.length > 0 && isValidFile
    // );
  }

  private _createSaveSubscription() {
    return this.branch
      ? this.brachService.update(
          this.branch.id,
          this.FormBranch.value,
          this.selectedServices.map(({ id }) => id)
        )
      : this.brachService.create(
          this.FormBranch.value,
          this.selectedServices.map(({ id }) => id)
        );
  }

  private _saveBranch() {
    const subcription = this.branch
      ? this.brachService.update(
          this.branch.id,
          this.FormBranch.value,
          this.selectedServices.map(({ id }) => id)
        )
      : this.brachService.create(
          this.FormBranch.value,
          this.selectedServices.map(({ id }) => id)
        );

    subcription.subscribe((branch) => this.ref.close(branch));
  }
  private _saveBranchWithtFile() {}

  private _listenDropdowChange() {
    this.searchSubject$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(350),
        switchMap((value) => this.serviceService.searchAvailables(value))
      )
      .subscribe((services) => this.services.set(services));
  }

  private _loadFormData() {
    if (!this.branch) return;
    const { services, ...props } = this.branch;
    this.FormBranch.patchValue({ ...props });
    // this.selectedServices.
  }

  addVideos(files: File[]) {
    this.videos = files;
    this.previewVideos.update((values) => [
      ...values,
      ...files.map((el) => URL.createObjectURL(el)),
    ]);
    this.fileUpload.clear();
  }
}
