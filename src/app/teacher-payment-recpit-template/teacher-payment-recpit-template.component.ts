import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { courseWiseMonths } from '../shared/models/courseWiseMonthsVM';
import { reciptTemplateDataVM } from '../shared/models/reciptTemplateDataVM';
import { emailVM } from '../shared/models/emailVM';
import { SubSink } from 'subsink';
import { EmailService } from '../shared/services/email.service';
import { teacherPaymentReciptDataVM } from '../shared/models/teacherPaymentReciptDataVM';
import { MonthVM } from '../shared/models/monthVM';
import { courseWisePaymentVM } from '../shared/models/courseWisePaymentVM';
import { teacherEmailVM } from '../shared/models/teacherEmailVM';

@Component({
  selector: 'app-teacher-payment-recpit-template',
  templateUrl: './teacher-payment-recpit-template.component.html',
  styleUrls: ['./teacher-payment-recpit-template.component.css']
})
export class TeacherPaymentRecpitTemplateComponent  implements OnInit, OnChanges, OnDestroy {

  @Input() reciptTemplateDataVM : teacherPaymentReciptDataVM | undefined;
  teacherEmail : string | undefined;
  private subs = new SubSink();
  parentEmail :  string | undefined;
  month : MonthVM | undefined;
  total : number = 0;
  
  today: number = Date.now();
  courseWisePayment : courseWisePaymentVM[]=[]

  constructor(
    private emailService : EmailService
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.courseWisePayment = this.reciptTemplateDataVM?.courseWisePayment ? this.reciptTemplateDataVM?.courseWisePayment : []
    this.teacherEmail = this.reciptTemplateDataVM?.teacher?.email;
    this.month = this.reciptTemplateDataVM?.month
  }

  generatePDF():any{
    const reciptContainer = document.querySelector('.receipt-container') as HTMLElement;
    html2canvas(reciptContainer, {scale:2}).then(canvas => {
      const pdf = new jsPDF();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG' , 0,0,211,298);
      pdf.save('receipt.pdf')

      const pdfBase64 = pdf.output('datauristring').split(',')[1];

      
      const emailData : teacherEmailVM = {
        pdfBase64 : pdfBase64,
        teacherEmail : this.teacherEmail
      }

      this.subs.sink = this.emailService.sendTeacherRecipt(emailData).subscribe(data =>{
        if(data){
        }
      })
    })
  }
}
