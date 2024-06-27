import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  input,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles:`
    .video-container {
  position: relative;
  width: 100%;
  /* Asegúrate de que el contenedor del video tenga un tamaño adecuado */
}

.video-element {
  width: 100%;
  display: block;
}

.video-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%; /* Ajusta la altura del gradiente según sea necesario */
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
  pointer-events: none; /* Asegúrate de que los eventos de ratón pasen a través del gradiente */
}

  `
})
export class VideoPlayerComponent implements OnInit {
  videoElementRef = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');

  urls = input.required<string[]>();
  index: number = 0;

  ngOnInit(): void {
    this._loadVideo();
  }

  playNext() {
    this.index++;
    if (this.index === this.urls().length) this.index = 0;
    this._loadVideo();
  }

  private _loadVideo() {
    this.videoElementRef().nativeElement.src = this.urls()[this.index];
    this.videoElementRef().nativeElement.play();
  }
}
