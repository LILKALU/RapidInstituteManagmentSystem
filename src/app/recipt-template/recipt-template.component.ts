import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { courseWiseMonths } from '../shared/models/courseWiseMonthsVM';
import { reciptTemplateDataVM } from '../shared/models/reciptTemplateDataVM';
import { emailVM } from '../shared/models/emailVM';
import { SubSink } from 'subsink';
import { EmailService } from '../shared/services/email.service';

@Component({
  selector: 'app-recipt-template',
  templateUrl: './recipt-template.component.html',
  styleUrls: ['./recipt-template.component.css']
})
export class ReciptTemplateComponent implements OnInit, OnChanges, OnDestroy{

  @Input() reciptTemplateDataVM : reciptTemplateDataVM | undefined;
  studentEmail : string | undefined;
  private subs = new SubSink();
  parentEmail :  string | undefined;
  
  today: number = Date.now();
  courseWiseMonths : courseWiseMonths[]=[]

  constructor(
    private emailService : EmailService
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.courseWiseMonths = this.reciptTemplateDataVM?.courseWiseMonths ? this.reciptTemplateDataVM?.courseWiseMonths : []
    this.studentEmail = this.reciptTemplateDataVM?.student?.email;
    this.parentEmail = this.reciptTemplateDataVM?.student?.parent?.email
  }

  generatePDF():any{
    const reciptContainer = document.querySelector('.receipt-container') as HTMLElement;
    html2canvas(reciptContainer, {scale:2}).then(canvas => {
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG' , 0,0,211,298);
      pdf.save('receipt.pdf')

      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      
      const emailData : emailVM = {
        pdfBase64 : pdfBase64,
        parentEmail : this.parentEmail,
        studentEmail : this.studentEmail
      }

      this.subs.sink = this.emailService.sendRecipt(emailData).subscribe(data =>{
        if(data){
          console.log(data);
        }
      })
    })
  }
}
