import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gradesResponse } from '../models/gradesResponseVM';
import { Observable } from 'rxjs';
import { gradeResponse } from '../models/gradeResponseVM';
import { GradeVM } from '../models/gradeVM';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private BaseURL = "http://localhost:8080/api/v1/gradectrl"

  constructor(private httpClient: HttpClient) { }

  getGrades() : Observable<gradesResponse>{
    return this.httpClient.get<gradesResponse>(`${this.BaseURL}/getgrades`);
  }

  createGrade(grade : GradeVM) : Observable<gradeResponse>{
    return this.httpClient.post<gradeResponse>(`${this.BaseURL}/addgrade`,grade);
  }

  updateGrade(grade : GradeVM) : Observable<gradeResponse>{
    return this.httpClient.put<gradeResponse>(`${this.BaseURL}/updategrade`,grade);
  }

  deleteGrade(grade : GradeVM) : Observable<gradeResponse>{
    return this.httpClient.put<gradeResponse>(`${this.BaseURL}/deletegrade`,grade);
  }
}
