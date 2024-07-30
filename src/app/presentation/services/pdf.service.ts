import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { reportWorkResponse } from '../../infrastructure';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  generateReportWork(fullname: string, data: reportWorkResponse[], date: Date) {
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'LETTER',
      pageMargins: [30, 30, 30, 30],
      content: [
        {
          text: 'Reporte Trabajo',
          fontSize: 18,
          bold: true,
        },
        {
          text: fullname,
          fontSize: 14,
        },
        {
          margin: [0, 20, 0, 0],
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: ['*', '*', 50],
            body: [
              ['Servicio', 'Detalle', ''],
              ...data.flatMap((item) =>
                item.details.map((detail) => [
                  { sta: item.service, rowSpan: 3 },
                  's',
                  's',
                ])
              ),

              // { text: el.service, rowSpan: el.service.length },
              // {
              //   table: {
              //     body: [
              //       ...el.details.map((detail) => [
              //         detail.status,
              //         detail.total,
              //       ]),
              //     ],
              //   },
              //   layout: 'noBorders',
              // },
              // 'ds',
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],
      header: {
        margin: [0, 10, 20, 0],
        alignment: 'right',
        text: date.toLocaleString(),
      },
    };
    pdfMake.createPdf(docDefinition).print();
  }
}
