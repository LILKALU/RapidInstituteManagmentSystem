import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../../services/local-storage.service';
import { loginDetailsVM } from '../../models/loginDetailsVM';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  logedDetails : loginDetailsVM | undefined;
  
  constructor(
    private localStorageService : LocalStorageService,
    private router: Router
  ){}
  
  canActivate(): boolean {
    let loginData: any = this.localStorageService.getItem('login');
    this.logedDetails = loginData ? JSON.parse(loginData) : null;
    if (this.logedDetails) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
  
}
