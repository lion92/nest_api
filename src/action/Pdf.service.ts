import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import { ActionService } from './Action.service';

@Injectable()
export class PdfService {
  constructor(private actionService: ActionService) {
  }

  async generatePdf(id: number): Promise<fs.ReadStream> {
    const newVar1 = await this.actionService.findByUser(id);
    console.log(newVar1);
    const doc = new PDFDocument();
    doc.text('Bilan');
    newVar1.forEach((value) =>
      doc.text(' ' + value.montant + ' ' + value.description+ ' '+ value.categorie+' '+''+value.dateTransaction),
    );

    const fileName = 'bilan.pdf';
    doc.pipe(fs.createWriteStream(fileName));
    doc.end();

    return fs.createReadStream(fileName);
  }

  async generatePdfSumAll(id: number): Promise<fs.ReadStream> {
    const newVar1 = await this.actionService.findCategorieSumAll(id);
    console.log(newVar1);
    const doc = new PDFDocument();
    doc.text('Bilan');
    newVar1.forEach((value) =>
      doc.text(' ' + value.montant +' '+ value.categorie+' '+''+value.dateTransaction),
    );

    const fileName = 'bilan.pdf';
    doc.pipe(fs.createWriteStream(fileName));
    doc.end();

    return fs.createReadStream(fileName);
  }
}
