import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassFeeVM } from '../models/classFeeVM';
import { classFeeResponse } from '../models/classFeeResponse';

@Injectable({
  providedIn: 'root'
})
export class ClassFeeService {

  private BaseURL = "http://localhost:8080/api/v1/classfeectrl"

  constructor(private httpClient: HttpClient) { }

  addStudentClassFees(classFee : ClassFeeVM) : Observable<classFeeResponse> {
    return this.httpClient.post<classFeeResponse>(`${this.BaseURL}/addclassfee`,classFee);
  }
}
