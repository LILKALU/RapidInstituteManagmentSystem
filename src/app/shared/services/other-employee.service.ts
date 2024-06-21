import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { otherEmployeeVM } from '../models/oterEmployeeVM';
import { otherEmployeeResponseVM } from '../models/otherEmployeeResponseVM';
import { Observable } from 'rxjs';
import { otherEmployeesResponseVM } from '../models/otherEmployeesResponseVM';

@Injectable({
  providedIn: 'root'
})
export class OtherEmployeeService {

  constructor(private httpClient: HttpClient) { }

  private BaseURL = "http://localhost:8080/api/v1/otheremployee"

  addOtherEmployee(otherEmpolee : otherEmployeeVM) : Observable<otherEmployeeResponseVM>{
    return this.httpClient.post<otherEmployeeResponseVM>(`${this.BaseURL}/addemployee`,otherEmpolee);
  }

  getOtherEmployees() : Observable<otherEmployeesResponseVM>{
    return this.httpClient.get<otherEmployeesResponseVM>(`${this.BaseURL}/getotheremployees`)
  }

  updateOrDeleteEmployee(otherEmpolee : otherEmployeeVM): Observable<otherEmployeeResponseVM>{
    return this.httpClient.put<otherEmployeeResponseVM>(`${this.BaseURL}/updateordeleteemployee`,otherEmpolee);
  }
}
