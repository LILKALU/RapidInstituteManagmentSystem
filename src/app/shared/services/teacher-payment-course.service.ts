import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { monthWiseIncomesResponseVM } from '../models/monthWiseIncomeResponseVM';

@Injectable({
  providedIn: 'root'
})
export class TeacherPaymentCourseService {

  private BaseURL = "http://localhost:8080/api/v1/teacherpaymentcoursectrl"

  constructor(private httpClient: HttpClient) { }

  getTeacherPaymentByMonth(year : number) : Observable<monthWiseIncomesResponseVM>{
    return this.httpClient.get<monthWiseIncomesResponseVM>(`${this.BaseURL}/getteacherpaymentbymonth/${year}`); 
  }
}
