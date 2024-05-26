import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnrolmentsResponse } from '../models/enrolmentsResponseVM';
import { EnrolmentsCoursesResponse } from '../models/enrolmentCoursesResponseVM';
import { EnrolmentCourseVM } from '../models/enrolmentCourse';
import { EnrolmentsCourseResponse } from '../models/enrolmentsCoursesResponse';

@Injectable({
  providedIn: 'root'
})
export class EnrolmentCourseService {

  private BaseURL = "http://localhost:8080/api/v1/enrolmentcoursectrl";

  constructor(private httpClient: HttpClient) { }

  getEnrolmentCourse(): Observable<EnrolmentsCoursesResponse> {
    return this.httpClient.get<EnrolmentsCoursesResponse>(`${this.BaseURL}/getenrolmentcourse`);
  }

  deleteCourse(enrolmentCourse :EnrolmentCourseVM) : Observable<EnrolmentsCourseResponse> {
    return this.httpClient.put<EnrolmentsCourseResponse>(`${this.BaseURL}/deleteenrolmentcourse`,enrolmentCourse);
  }

  deleteCourses(enrolmentCourse :EnrolmentCourseVM[]) : Observable<EnrolmentsCoursesResponse> {
    return this.httpClient.put<EnrolmentsCoursesResponse>(`${this.BaseURL}/deleteenrolmentcourses`,enrolmentCourse);
  }
}
