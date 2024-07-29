import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { approvingStatusesResponseVM } from '../models/approvingStatusesResponsVM';

@Injectable({
  providedIn: 'root'
})
export class ApprovingStatusService {

  private BaseURL = "http://localhost:8080/api/v1/approvinststusctrl";

  constructor(private httpClient: HttpClient) { }

  getApprovingStatuses() :Observable<approvingStatusesResponseVM>{
    return this.httpClient.get<approvingStatusesResponseVM>(`${this.BaseURL}/getapprovingstatuses`);
  }
}
