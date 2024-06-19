import { Injectable } from '@angular/core';
import { sha256 } from 'js-sha256';
import qz from 'qz-tray';
import EscPosEncoder from 'esc-pos-encoder';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor() {
    // this._setupConfig();
  }

  private _setupConfig() {
    qz.api.setSha256Type((data: any) => sha256(data));
    qz.api.setPromiseType(async (resolver) => new Promise(resolver));
    qz.websocket
      .connect()
      .then(() => qz.printers.getDefault)
      .catch((err) =>
        console.error('No se pudo conectar con la impresora:', err)
      );
  }

  async getDefaultPrinter(): Promise<string> {
    try {
      const printer = await qz.printers.getDefault();
      console.log('Default printer:', printer);
      return printer;
    } catch (error) {
      console.error('Error getting default printer:', error);
      return '';
    }
  }

  async print() {
    let encoder = new EscPosEncoder();

    let result = encoder
      .initialize()
      .text('The quick brown fox jumps over the lazy dog')
      .newline()
      .encode();
    console.log(result);
  }
}
