import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourseResponse } from '../models/courseResponse';
import { CourseVM } from '../models/coursesVM';
import { CourseResponses } from '../models/courseResponses';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private BaseURL = "http://localhost:8080/api/v1/coursectrl"

  constructor(private httpClient: HttpClient) { }

  getCourses() : Observable<CourseResponse> {
    return this.httpClient.get<CourseResponse>(`${this.BaseURL}/getcourses`)
  }

  getCoursesByTeacherId(teacherId : number) : Observable<CourseResponse> {
    return this.httpClient.get<CourseResponse>(`${this.BaseURL}/getcoursesbyteacherid/${teacherId}`)
  }

  getCoursesByDate(date : string) : Observable<CourseResponse> {
    return this.httpClient.get<CourseResponse>(`${this.BaseURL}/getcoursesbydate/${date}`)
  }

  getTodayTeacherCourse(date : string , teacherId : number) : Observable<CourseResponse> {
    return this.httpClient.get<CourseResponse>(`${this.BaseURL}/getcoursesbydateandteacher/${date}/${teacherId}`)
  }

  getTodayStudentCourse(date : string , studentId : number) : Observable<CourseResponse> {
    return this.httpClient.get<CourseResponse>(`${this.BaseURL}/getcoursesbydateandstudentid/${date}/${studentId}`)
  }

  createCourse(course :CourseVM) : Observable<CourseResponses> {
    return this.httpClient.post<CourseResponses>(`${this.BaseURL}/addcourse`,course);
  }

  deleteCourse(course :CourseVM) : Observable<CourseResponses> {
    return this.httpClient.put<CourseResponses>(`${this.BaseURL}/deletecourse`,course);
  }

  updateCourse(course :CourseVM) : Observable<CourseResponses> {
    return this.httpClient.put<CourseResponses>(`${this.BaseURL}/updatecourse`,course);
  }

  getCanceledCoursesByDate(date : string, day:string) : Observable<CourseResponse> {
    return this.httpClient.get<CourseResponse>(`${this.BaseURL}/getcanceledcoursesbydate/${date}/${day}`)
  }
}
