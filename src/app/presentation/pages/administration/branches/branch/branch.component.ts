import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
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
import { Subject, concat, debounceTime, switchMap } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { brachResponse } from '../../../../../infrastructure/interfaces';
import { BranchService, ServiceService } from '../../../../services';
import { PrimengModule } from '../../../../../primeng.module';
import { FileSelectEvent } from 'primeng/fileupload';
interface serviceProps {
  id: string;
  name: string;
}
enum platforms {
  Local = 'Local',
  YouTube = 'YouTube',
  Facebook = 'Facebook',
}
@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [CommonModule, PrimengModule, ReactiveFormsModule, FormsModule],
  templateUrl: './branch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchComponent implements OnInit {
  private brachService = inject(BranchService);
  private serviceService = inject(ServiceService);
  private fb = inject(FormBuilder);
  private branch?: brachResponse = inject(DynamicDialogConfig).data;
  private ref = inject(DynamicDialogRef);
  private dropdown = viewChild.required<Dropdown>('dropdown');

  private searchSubject$ = new Subject<string>();
  private destroyRef = inject(DestroyRef);

  readonly maxFileSize = 1 * 1024 * 1024 * 2024;

  platform: platforms = platforms.Local;

  services = signal<serviceProps[]>([]);
  selectedServices = signal<serviceProps[]>([]);
  FormBranch: FormGroup = this.fb.group({
    name: ['', Validators.required],
    marqueeMessage: ['', Validators.required],
    videoPlatform: [platforms.Local, Validators.required],
    videoUrl: [''],
  });

  videoPlatforms = Object.values(platforms);
  fileToUpload: File | null = null;

  ngOnInit(): void {
    this.searchSubject$
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(350))
      .subscribe((text) => this.searchServices(text));
  }

  save() {
    if (this.platform === platforms.Local) {
      this.brachService
        .uploadVideo(this.fileToUpload!)
        .pipe(
          switchMap(({ file }) => {
            this.FormBranch.patchValue({ videoUrl: file });
            return this._createSaveSubscription();
          })
        )
        .subscribe((branch) => this.ref.close(branch));
    } else {
      this._createSaveSubscription().subscribe((branch) =>
        this.ref.close(branch)
      );
    }
  }

  onFilterDropdown(term?: string) {
    if (!term) return;
    this.searchSubject$.next(term);
  }

  searchServices(term: string) {
    this.serviceService
      .searchAvailables(term)
      .subscribe((services) => this.services.set(services));
  }

  addService(service: serviceProps) {
    this.dropdown().resetFilter();
    const duplicate = this.selectedServices().find(
      ({ id }) => id === service.id
    );
    if (duplicate) return;
    this.selectedServices.update((values) => [service, ...values]);
  }

  removeService(service: serviceProps) {
    this.selectedServices.update((values) =>
      values.filter((el) => el.id !== service.id)
    );
  }

  onPlatformChange(value: platforms) {
    this.platform = value;
    const validators = value !== platforms.Local ? [Validators.required] : [];
    this.FormBranch.setControl('videoUrl', new FormControl('', validators));
  }

  onFileSelect(event: FileSelectEvent) {
    const file = event.files[0];
    this.fileToUpload = file;
  }

  onFileRemove() {
    this.fileToUpload = null;
  }

  get isFormValid(): boolean {
    const isValidFile =
      this.platform === platforms.Local ? this.fileToUpload != null : true;
    return (
      this.FormBranch.valid && this.selectedServices().length > 0 && isValidFile
    );
  }

  private _createSaveSubscription() {
    return this.branch
      ? this.brachService.update(
          this.branch.id,
          this.FormBranch.value,
          this.selectedServices().map(({ id }) => id)
        )
      : this.brachService.create(
          this.FormBranch.value,
          this.selectedServices().map(({ id }) => id)
        );
  }
}
