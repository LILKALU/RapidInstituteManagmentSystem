import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeachersResponse } from '../models/teachersResponse';
import { teacherVM } from '../models/teachersVM';
import { TeacherResponse } from '../models/teacherResposeVM';
import { courseWisePaymentsResponseVM } from '../models/courseWisePaymentsResponseVM';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private BaseURL = "http://localhost:8080/api/v1/teacherctrl";

  constructor(
    private httpClient: HttpClient
  ) { }

  getTeachers() : Observable<TeachersResponse>{
    return this.httpClient.get<TeachersResponse>(`${this.BaseURL}/getteachers`);
  }

  getTeacher(usercode : string) : Observable<TeacherResponse>{
    return this.httpClient.get<TeacherResponse>(`${this.BaseURL}/getteacher/${usercode}`);
  }

  addTeacher(teacher : teacherVM) : Observable<TeacherResponse>{
    return this.httpClient.post<TeacherResponse>(`${this.BaseURL}/createteacher`,teacher);
  }

  updateTeacher(teacher : teacherVM) : Observable<TeacherResponse>{
    return this.httpClient.put<TeacherResponse>(`${this.BaseURL}/updateteacher`,teacher);
  }

  deleteTeacher(teacher : teacherVM) : Observable<TeacherResponse>{
    return this.httpClient.put<TeacherResponse>(`${this.BaseURL}/deleteteacher`,teacher);
  }

  getCourseWisePayments(teacherId : number, monthId : number) : Observable<courseWisePaymentsResponseVM>{
    return this.httpClient.get<courseWisePaymentsResponseVM>(`${this.BaseURL}/getteacherearningsformonthbycoursewise/${teacherId}/${monthId}`);
  }
}
