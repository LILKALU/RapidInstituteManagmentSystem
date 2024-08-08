import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClassFeeVM } from '../models/classFeeVM';
import { classFeeResponse } from '../models/classFeeResponse';
import { classFeesResponse } from '../models/classfeesResponse';
import { studentWiseCoursesVM } from '../models/studentWiseCourseVM';
import { studentWiseCoursessVM } from '../models/studentWiseCoursesVM';
import { courseWiseMonthsResponseVM } from '../models/courseWiseMonthsResponseVM';
import { courseWiseMonthResponse } from '../models/courseWiseMonthResponseVM';

@Injectable({
  providedIn: 'root'
})
export class ClassFeeService {

  private BaseURL = "http://localhost:8080/api/v1/classfeectrl"

  constructor(private httpClient: HttpClient) { }

  addStudentClassFees(classFee : ClassFeeVM) : Observable<classFeeResponse> {
    return this.httpClient.post<classFeeResponse>(`${this.BaseURL}/addclassfee`,classFee);
  }

  getStudentClassFees(): Observable<classFeesResponse>{
    return this.httpClient.get<classFeesResponse>(`${this.BaseURL}/getclassfee`)
  }

  findFirstByStudentAndCourse(studentWiseCourses : studentWiseCoursesVM): Observable<classFeeResponse>{
    return this.httpClient.post<classFeeResponse>(`${this.BaseURL}/findfirstbystudentandcourse`,studentWiseCourses);
  }

  findLastByStudentAndCourse(studentWiseCourses : studentWiseCoursesVM): Observable<classFeeResponse>{
    return this.httpClient.post<classFeeResponse>(`${this.BaseURL}/findlastbystudentandcourse`,studentWiseCourses);
  }

  getUnpaidMonths(studentWiseCoursess : studentWiseCoursessVM) : Observable<courseWiseMonthsResponseVM>{
    return this.httpClient.post<courseWiseMonthsResponseVM>(`${this.BaseURL}/getunpaidmonths`,studentWiseCoursess)
  }

  getFirstPaidClassFee(studentWiseCoursess : studentWiseCoursessVM) : Observable<courseWiseMonthResponse>{
    return this.httpClient.post<courseWiseMonthResponse>(`${this.BaseURL}/getfirstpaiedmonth`,studentWiseCoursess)
  }
}
