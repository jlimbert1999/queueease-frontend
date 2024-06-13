import { Injectable } from '@angular/core';
import { concatMap, delay, from, of, tap } from 'rxjs';
import { ServiceRequest } from '../../domain/models';
import { numerToWords } from '../../helpers';
import { advertisementResponse } from '../../infrastructure/interfaces';

interface playlist {
  path: string;
  duration: number;
}
@Injectable({
  providedIn: 'root',
})
export class TextToSpeekService {
  constructor() {}

  speek({ code, counterNumber }: advertisementResponse) {
    return this._codeToSpeek(code, counterNumber);
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
      { path: '../../../assets/audio/phrases/FICHA.mp3', duration: 1000 },
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
    return this.playSound(playlist);
  }

  private _generatePlayList(characters: string[], type: 'letters' | 'numbers') {
    return characters.map((el) => {
      let duration: number = 900;
      if (el === 'Y') duration = 600;
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
    return from(playlist).pipe(
      concatMap((item) =>
        of(item).pipe(
          tap((item) => {
            const audio = new Audio(item.path);
            audio.volume = 1;
            audio.play();
            // console.log('playing audio', item.path);
          }),
          delay(item.duration)
        )
      )
    );
  }
}
