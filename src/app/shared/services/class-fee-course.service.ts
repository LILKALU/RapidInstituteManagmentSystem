import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { studentWiseCoursesVM } from '../models/studentWiseCourseVM';
import { Observable } from 'rxjs';
import { ClassFeeCourseVM } from '../models/classFeeCourseVM';
import { classFeeCourseResponseVM } from '../models/classFeeCourseResponseVM';
import { courseWiseClassFeeResponseVM } from '../models/courseWiseClassFeeResponseVM';

@Injectable({
  providedIn: 'root'
})
export class ClassFeeCourseService {

  private BaseURL = "http://localhost:8080/api/v1/classfeecoursectrl"
  constructor(private httpClient: HttpClient) { }

  findLastByStudentAndCourse(studentWiseCourses : studentWiseCoursesVM[]): Observable<courseWiseClassFeeResponseVM>{
    return this.httpClient.post<courseWiseClassFeeResponseVM>(`${this.BaseURL}/findlastbystudentandcourse`,studentWiseCourses);
  }

  findFirstByStudentAndCourse(studentWiseCourses : studentWiseCoursesVM[]): Observable<courseWiseClassFeeResponseVM>{
    return this.httpClient.post<courseWiseClassFeeResponseVM>(`${this.BaseURL}/findfirstbystudentandcourse`,studentWiseCourses);
  }

}
