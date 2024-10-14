import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { gradesResponse } from '../models/gradesResponseVM';
import { Observable } from 'rxjs';
import { gradeResponse } from '../models/gradeResponseVM';
import { GradeVM } from '../models/gradeVM';
import { DeleteAvailabilityResponseVM } from '../models/deleteAvailabilityResponseVM';

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private BaseURL = "http://localhost:8080/api/v1/gradectrl"

  constructor(private httpClient: HttpClient) { }

  getGrades() : Observable<gradesResponse>{
    return this.httpClient.get<gradesResponse>(`${this.BaseURL}/getgrades`);
  }

  checkGradeDeleteAvailability(gradeId : number) : Observable<DeleteAvailabilityResponseVM>{
    return this.httpClient.get<DeleteAvailabilityResponseVM>(`${this.BaseURL}/getdeleteavailability/${gradeId}`);
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
