import { Injectable, signal } from '@angular/core';
import { numerToWords } from '../../helpers';
import { Observable, concatMap, delay, from, mapTo, timer } from 'rxjs';

interface playlist {
  path: string;
  duration: number;
}
@Injectable({
  providedIn: 'root',
})
export class TextToSpeekService {
  isPlaying = signal<boolean>(false);
  constructor() {}

  speek(text: string, counterNumber: number) {
    this._codeToSpeek(text, counterNumber);
  }

  private _codeToSpeek(text: string, counterNumber: number) {
    const [literalPart, numericPart] = this._splitCode(text);
    const firstPart = literalPart.split('');
    const secondPart = numerToWords(parseInt(numericPart)).split(' ');
    const counterName = numerToWords(counterNumber);
    const playlist: playlist[] = [
      {
        path: '../../../assets/audio/phrases/notification.mp3',
        duration: 1400,
      },
      { path: '../../../assets/audio/phrases/FICHA.mp3', duration: 1200 },
      ...this._generatePlayList(firstPart, 'letters'),
      ...this._generatePlayList(secondPart, 'numbers'),
      {
        path: '../../../assets/audio/phrases/PASE A LA VENTANILLA.mp3',
        duration: 2000,
      },
      {
        path: `../../../assets/audio/numbers/${counterName}.mp3`,
        duration: 1000,
      },
    ];
    this.playSound(playlist);
  }

  private _generatePlayList(characters: string[], type: 'letters' | 'numbers') {
    return characters.map((el) => {
      let duration: number = 900;
      if (el === 'Y') {
        duration = 500;
      }
      return {
        path: `../../../assets/audio/${type}/${el}.mp3`,
        duration: duration,
      };
    });
  }

  private _splitCode(codigo: string) {
    const match = codigo.match(/^([A-Za-z-]+)([0-9]+)$/);
    if (!match) return ['', ''];
    return [match[1], match[2]];
  }

  private playSound(playlist: playlist[]) {
    if (this.isPlaying()) return;
    this.isPlaying.set(true);
    from(playlist)
      .pipe(concatMap((item) => this.playAudio(item)))
      .subscribe({
        complete: () => {
          this.isPlaying.set(false);
        },
      });
  }

  private playAudio(item: playlist): Observable<void> {
    return new Observable<void>((observer) => {
      const audio = new Audio(item.path);
      audio.play();
      observer.next();
      observer.complete();
    }).pipe(delay(item.duration));
  }
}
