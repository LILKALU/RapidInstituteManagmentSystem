import { Injectable } from '@angular/core';
import { leaveRequestVM } from '../models/leaveRequestVM';
import { Observable } from 'rxjs';
import { leaveRequestResponseVM } from '../models/leaveRequestResponseVM';
import { HttpClient } from '@angular/common/http';
import { leaveRequestsResponseVM } from '../models/leaveRequestsResponseVM';
import { approvingStatusVM } from '../models/approvingStatusVM';

@Injectable({
  providedIn: 'root'
})
export class LeaveRequestService {

  private BaseURL = "http://localhost:8080/api/v1/leaverequest";

  constructor(private httpClient: HttpClient) { }

  makeRequest(request :leaveRequestVM) : Observable<leaveRequestResponseVM> {
    return this.httpClient.post<leaveRequestResponseVM>(`${this.BaseURL}/makeleaverequest`,request);
  }

  updateOrDeleteRequest(request :leaveRequestVM) : Observable<leaveRequestResponseVM> {
    return this.httpClient.put<leaveRequestResponseVM>(`${this.BaseURL}/updateordeleteleaverequest`,request);
  }

  getRequestByApprovingStatus(status :approvingStatusVM) : Observable<leaveRequestsResponseVM> {
    return this.httpClient.post<leaveRequestsResponseVM>(`${this.BaseURL}/getleaverequestbyapprovingstatus`,status);
  }

  getRequest(userCode : string) : Observable<leaveRequestsResponseVM> {
    return this.httpClient.get<leaveRequestsResponseVM>(`${this.BaseURL}/getleaverequest/${userCode}`);
  }
}
