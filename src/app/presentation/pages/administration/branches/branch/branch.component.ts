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
import { Subject, debounceTime, switchMap } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  brachResponse,
  serviceResponse,
} from '../../../../../infrastructure/interfaces';
import { BranchService, ServiceService } from '../../../../services';
import { PrimengModule } from '../../../../../primeng.module';
import { FileSelectEvent } from 'primeng/fileupload';

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
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private branch?: brachResponse = inject(DynamicDialogConfig).data;

  private dropdown = viewChild.required<Dropdown>('dropdown');
  private searchSubject$ = new Subject<string>();

  readonly maxFileSize = 1 * 1024 * 1024 * 2024;
  readonly videoPlatforms = Object.values(platforms);

  platform: platforms = platforms.Local;
  services = signal<serviceResponse[]>([]);
  selectedServices = signal<serviceResponse[]>([]);
  FormBranch: FormGroup = this.fb.group({
    name: ['', Validators.required],
    marqueeMessage: ['', Validators.required],
    videoPlatform: [platforms.Local, Validators.required],
    videoUrl: [''],
  });

  video: File | null = null;
  videoUrl = signal<string | ArrayBuffer | null>(null);

  constructor() {
    this._listenDropdowChange();
  }

  ngOnInit(): void {
    this._loadFormData();
  }

  save() {
    if (this.platform === platforms.Local) {
      this.brachService
        .uploadVideo(this.video!)
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

  onFilterDropdown(term: string = '') {
    if (!term) return;
    this.searchSubject$.next(term);
  }

  searchServices(term: string) {
    this.serviceService
      .searchAvailables(term)
      .subscribe((services) => this.services.set(services));
  }

  addService(service: serviceResponse) {
    console.log('exec');
    this.dropdown().resetFilter();

    const duplicate = this.selectedServices().some(
      ({ id }) => id === service.id
    );
    if (duplicate) return;
    this.selectedServices.update((values) => [service, ...values]);
    this.dropdown().clear();
  }

  removeService(service: serviceResponse) {
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
    this.video = file;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      this.videoUrl.set((<FileReader>event.target).result);
    };
  }

  onFileRemove() {
    this.video = null;
  }

  get isFormValid(): boolean {
    const isValidFile =
      this.platform === platforms.Local ? this.video != null : true;
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

  private _saveBranch() {
    const subcription = this.branch
      ? this.brachService.update(
          this.branch.id,
          this.FormBranch.value,
          this.selectedServices().map(({ id }) => id)
        )
      : this.brachService.create(
          this.FormBranch.value,
          this.selectedServices().map(({ id }) => id)
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
    this.selectedServices.set([...services]);
  }
}
