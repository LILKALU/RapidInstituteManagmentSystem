import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubjectsResponseVM } from '../models/subjectsResponseVM';
import { SubjectVM } from '../models/subjectVM';
import { SubjectResponseVM } from '../models/subjectResponseVM';
import { DeleteAvailabilityResponseVM } from '../models/deleteAvailabilityResponseVM';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private BaseURL = "http://localhost:8080/api/v1/subctrl";

  constructor(private httpClient: HttpClient) { }

  getSubjects() : Observable<SubjectsResponseVM>{
    return this.httpClient.get<SubjectsResponseVM>(`${this.BaseURL}/getsubjects`);
  }

  createSubject(subject : SubjectVM) : Observable<SubjectResponseVM>{
    return this.httpClient.post<SubjectResponseVM>(`${this.BaseURL}/createsubject`,subject);
  }

  updateSubject(subject : SubjectVM) : Observable<SubjectResponseVM>{
    return this.httpClient.put<SubjectResponseVM>(`${this.BaseURL}/updatesubject`,subject);
  }

  deleteSubject(subject : SubjectVM) : Observable<SubjectResponseVM>{
    return this.httpClient.put<SubjectResponseVM>(`${this.BaseURL}/deletesubject`,subject);
  }

  checkGradeDeleteAvailability(subId : number) : Observable<DeleteAvailabilityResponseVM>{
    return this.httpClient.get<DeleteAvailabilityResponseVM>(`${this.BaseURL}/getdeleteavailability/${subId}`);
  }
}
