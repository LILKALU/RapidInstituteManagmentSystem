import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { roleVM } from '../models/roleVM';
import { roleResponseVM } from '../models/roleResponseVM';
import { Observable } from 'rxjs';
import { rolesResponseVM } from '../models/rolesResponseVM';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private BaseURL = "http://localhost:8080/api/v1/rolectrl";

  constructor(private httpClient: HttpClient) { }
  
  addRole(role : roleVM) : Observable<roleResponseVM>{
    return this.httpClient.post<roleResponseVM>(`${this.BaseURL}/addrole`,role);
  }

  getRoles() : Observable<rolesResponseVM>{
    return this.httpClient.get<rolesResponseVM>(`${this.BaseURL}/getroles`);
  }

  updateAndDeleteRole(role : roleVM) : Observable<roleResponseVM>{
    return this.httpClient.put<roleResponseVM>(`${this.BaseURL}/updaterole`,role)
  }
}
