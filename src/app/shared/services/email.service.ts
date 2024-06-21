import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { emailVM } from '../models/emailVM';
import { Observable } from 'rxjs';
import { emailResponseVM } from '../models/emailResponseVM';
import { teacherEmailVM } from '../models/teacherEmailVM';
import { teacherEmailResponseVM } from '../models/teacherEmailResponseVM';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private BaseURL = "http://localhost:8080/api/v1/emailctrl"

  constructor(private httpClient: HttpClient) { }

  sendRecipt(emailData :emailVM) : Observable<emailResponseVM> {
    return this.httpClient.post<emailResponseVM>(`${this.BaseURL}/sendreciptemail`,emailData);
  }

  sendTeacherRecipt(emailData :teacherEmailVM) : Observable<teacherEmailResponseVM> {
    return this.httpClient.post<teacherEmailResponseVM>(`${this.BaseURL}/sendteacherreciptemail`,emailData);
  }
}
