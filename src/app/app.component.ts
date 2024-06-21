import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from './shared/services/local-storage.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'RapidInstituteManagmentSystem';
  isLoginSuccess : boolean = false;
  private subs = new SubSink();

  constructor( 
    private localStorageService : LocalStorageService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.checkLocalStorage()
  }

  checkLocalStorage(){
    if(this.localStorageService.getItem('login').length > 0){
      this.isLoginSuccess = true;
      this.router.navigate(['Dashboard']);
    }else{
      this.isLoginSuccess = false;
      this.router.navigate(['login']);
    }
  }

  logout(event : boolean){
    if(event){
      this.isLoginSuccess = false;
      this.router.navigate(['login']);
    }else{
      this.isLoginSuccess = true;
      this.router.navigate(['Dashboard']);
    }
  }

  login(event : boolean){
    if(event){
      this.isLoginSuccess = true;
      this.router.navigate(['Dashboard']);
    }else{
      this.isLoginSuccess = false;
      this.router.navigate(['login']);
    }
  }
}
