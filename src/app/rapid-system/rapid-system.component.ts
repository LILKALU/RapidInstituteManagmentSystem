import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { SubSink } from 'subsink';
import { appIconVM } from '../shared/models/appIconVM';
import { AppIconService } from '../shared/services/app-icon.service';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdAccountServiceService } from '../shared/services/ad-account-service.service';
import { ADAccountVM } from '../shared/models/adAccountVM';
import { MessageService } from 'primeng/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-rapid-system',
  templateUrl: './rapid-system.component.html',
  styleUrls: ['./rapid-system.component.css']
})
export class RapidSystemComponent implements OnInit, OnDestroy {
  selectedModuleEnum : number = 1;
  private subs = new SubSink();
  appIcons : appIconVM[]=[]
  loginForm !: FormGroup;
  passwordChangeForm !: FormGroup;
  isLoading : boolean = false;
  isUpdating : boolean = false;
  isPasswordChangeOpen: boolean = false;
  logedDetails : loginDetailsVM | undefined;
  adAccount : ADAccountVM | undefined;
  privilages : privilagesVM[] = [];
  name : string | undefined;
  usercode : string ='';
  isPasswordCorrect : boolean = false
  activeStepIndex : number = 0;
  steps = [
    { label: 'Verify Password'},
    { label: 'Change Password'}
  ];

  @Output() isLogout = new EventEmitter<boolean>();

  get getLoginPassword(): AbstractControl { return this.loginForm.get('password') as AbstractControl; }
  get getNewPassword(): AbstractControl { return this.passwordChangeForm.get('newPassword') as AbstractControl; }
  get getConfirmPassword(): AbstractControl { return this.passwordChangeForm.get('confirmPassword') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private appIconService : AppIconService, 
    private localStorageService : LocalStorageService,
    private adAccountService : AdAccountServiceService,
    private router : Router,
    private messageService: MessageService,
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
    this.buildForms()
    this.isLogout.emit(false);
  }

  buildForms(){
    this.loginForm = this.formBuilder.group({
      password : ['',Validators.required]
    })

    this.passwordChangeForm = this.formBuilder.group({
      newPassword : ['',Validators.required],
      confirmPassword : ['',Validators.required]
    })
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
    this.name = this.logedDetails?.fullName.split(" ")[0];
    this.usercode = this.logedDetails?.usercode ? this.logedDetails?.usercode : '';
    this.getAppIcons()
  }

  getAppIcons(){
    this.isLoading = true;
    this.subs.sink = this.appIconService.getAppIcons().subscribe(data =>{
      if(data && data.content){
        this.appIcons = data.content;
        this.isLoading = false;
      }
    })
  }

  changePassword(){
    this.isUpdating = true;
    let newPassword : string = this.getNewPassword.value;
    let confirmPassword : string = this.getConfirmPassword.value;
    let ad : ADAccountVM | undefined;

    if(newPassword === confirmPassword){
      ad = {
        ...this.adAccount,
        passWord : confirmPassword
      }

      this.subs.sink = this.adAccountService.updateUserAccount(ad).subscribe(data => {
        if(data && data.content){
          this.isUpdating = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Password Updated' });
        }
      });

    }else{
      this.isUpdating = false;
      this.messageService.add({ severity: 'warn', summary: 'Faild', detail: 'Password mismatch' });
    }

  }

  closePassWordChangePopup(){
    this.isPasswordChangeOpen = false;
    this.activeStepIndex = 0;
  }

  checkPassword(){
    this.isLoading = true;
    let loginDetails : ADAccountVM;

    loginDetails = {
      userCode : this.usercode,
      passWord : this.getLoginPassword.value
    }
    

    this.subs.sink = this.adAccountService.getALogin(loginDetails).subscribe(data =>{
      if(data && data.content){
        this.adAccount = data.content;
        this.isPasswordCorrect = true;

        if(this.isPasswordCorrect){
          this.activeStepIndex = this.activeStepIndex+1;
        }
        
        this.isLoading = false;
      }else{
        this.isLoading = false;
        this.messageService.add({ severity: 'warn', summary: 'Faild', detail: 'Wrong Password' });
      }
    })
  }

  reset(){
    this.loginForm.reset();
    this.passwordChangeForm.reset()
  }

  openPasswordChange(){
    this.isPasswordChangeOpen = true;
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
