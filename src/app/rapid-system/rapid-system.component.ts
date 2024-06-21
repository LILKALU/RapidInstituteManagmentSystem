import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { appIconVM } from '../shared/models/appIconVM';
import { AppIconService } from '../shared/services/app-icon.service';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rapid-system',
  templateUrl: './rapid-system.component.html',
  styleUrls: ['./rapid-system.component.css']
})
export class RapidSystemComponent implements OnInit, OnDestroy {
  selectedModuleEnum : number = 1;
  private subs = new SubSink();
  appIcons : appIconVM[]=[]
  isLoading : boolean = false;
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  name : string | undefined;

  @Output() isLogout = new EventEmitter<boolean>();

  constructor(
    private appIconService : AppIconService, 
    private localStorageService : LocalStorageService,
    private router : Router
  ){}

  changeModule(moduleEnum : number=0 , appIconeName : string = ''){
    this.selectedModuleEnum = moduleEnum;
    this.router.navigate([`/${appIconeName}`]);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getLoginData()
    this.isLogout.emit(false);
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    console.log("this.logedDetails",this.logedDetails);
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
    this.name = this.logedDetails?.fullName.split(" ")[0];
    this.getAppIcons()
  }

  getAppIcons(){
    this.isLoading = true;
    this.subs.sink = this.appIconService.getAppIcons().subscribe(data =>{
      if(data && data.content){
        this.appIcons = data.content;
        console.log(this.appIcons);
        this.isLoading = false;
      }
    })
  }

  isAllowed(appIconId : number = 0):boolean{
    if(this.privilages.filter(el => el && el.appIcon && el.appIcon.id == appIconId).length > 0){
      return true;
    }else{
      return false;
    }
  }

  logout(){
    this.localStorageService.removeItem('login')
    this.isLogout.emit(true);
    this.router.navigate(['login']);
  }
}
