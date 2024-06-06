import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import {
  brachResponse,
  serviceResponse,
} from '../../../../../infrastructure/interfaces';
import { BranchService, ServiceService } from '../../../../services';
import { PrimengModule } from '../../../../../primeng.module';
import { SecureUrlPipe } from '../../../../pipes/secure-url.pipe';

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

  save() {
    const services = this.selectedServices.map(({ id }) => id);
    this.brachService
      .uploadVideos(this.videos)
      .pipe(
        switchMap(({ files }) =>
          this.branch
            ? this.brachService.update({
                id: this.branch.id,
                videos: files,
                services: services,
                form: this.FormBranch.value,
              })
            : this.brachService.create(this.FormBranch.value, services, files)
        )
      )
      .subscribe((branch) => this.ref.close(branch));
  }

  onFilterDropdown(term: string) {
    if (!term) return;
    this.searchSubject$.next(term);
  }

  searchServices(term: string) {
    this.serviceService
      .searchAvailables(term)
      .subscribe((services) => this.services.set(services));
  }

  onSelectFiles(files: File[]) {
    this.videos = files;
    this.previewVideos.set(files.map((el) => URL.createObjectURL(el)));
    this.fileUpload.clear();
  }

  onSelectService(service: serviceResponse) {
    const duplicate = this.selectedServices.find(({ id }) => id === service.id);
    if (duplicate) {
      this.selectedServices = [...this.selectedServices];
    } else {
      this.selectedServices.push(service);
    }
  }

  get isFormValid(): boolean {
    return this.FormBranch.valid && this.selectedServices.length > 0;
  }

  get maxFileSize() {
    return 1 * 1024 * 1024 * 2024;
  }

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
    const { services, videos, ...props } = this.branch;
    this.FormBranch.patchValue({ ...props });
    this.selectedServices = services;
    this.previewVideos.set(videos);
  }
}
