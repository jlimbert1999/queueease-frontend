import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { convertImageABase64 } from '../../helpers';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

interface ticketProps {
  name: string;
  code: string;
  date: string;
}
@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  async generateTicket({ name, code, date }: ticketProps) {
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [40, 40, 40, 40],
      content: [
        {
          width: 140,
          height: 50,
          image: await convertImageABase64(
            '../../../assets/img/logo_alcaldia.jpeg'
          ),
        },
        { text: code, marginTop: 30 },
        { text: `Servicio: ${name}` },
        { text: new Date(date).toDateString() },
      ],
    };

    pdfMake.createPdf(docDefinition).print();
  }
}
