import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { studentVM } from '../models/studentVM';
import { studentResponseVM } from '../models/studentResponseVM';
import { studentAllResponseVM } from '../models/studentAllResponse';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private BaseURL = "http://localhost:8080/api/v1/studentctrl"

  constructor(private httpClient: HttpClient) { }

  // createStudent(student : studentVM) : Observable<any>{
  //   console.log(student);
    
  //   return this.httpClient.post(`${this.BaseURL}/addstudent`,student);
  // }

  updateStudent(student : studentVM) : Observable<studentResponseVM>{
    return this.httpClient.put<studentResponseVM>(`${this.BaseURL}/updatestudent`,student);
  }

  removeStudent(student : studentVM) : Observable<studentResponseVM>{
    return this.httpClient.put<studentResponseVM>(`${this.BaseURL}/removestudent`,student);
  }

  createStudent(student : studentVM) : Observable<studentResponseVM>{
    return this.httpClient.post<studentResponseVM>(`${this.BaseURL}/addstudent`,student);
  }

  getStudent():Observable<studentAllResponseVM>{
    return this.httpClient.get<studentAllResponseVM>(`${this.BaseURL}/getstudents`);
  }

  getStudentByScode(scode : string) : Observable<studentResponseVM>{
    return this.httpClient.get<studentResponseVM>(`${this.BaseURL}/getstudentbyscode/${scode}`);
  }
}
