import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { AdAccountServiceService } from '../shared/services/ad-account-service.service';
import { ADAccountVM } from '../shared/models/adAccountVM';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  isloading : boolean = false;
  loginForm !: FormGroup;
  logedDetails : loginDetailsVM | undefined;

  @Output() isLogginSuccess = new EventEmitter<boolean>();

  get getLoginUserCode(): AbstractControl { return this.loginForm.get('userName') as AbstractControl; }
  get getLoginPassword(): AbstractControl { return this.loginForm.get('password') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private adAccountService : AdAccountServiceService,
    private localStorageService : LocalStorageService,
    private messageService: MessageService,
  ){}


  ngOnInit(): void {
    this.buildForms()
    // this.getEmployee()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  buildForms(){
    this.loginForm = this.formBuilder.group({
      userName : ['',Validators.required],
      password : ['',Validators.required]

    })
  }

  login(){
    let loginDetails : ADAccountVM;

    loginDetails = {
      userCode : this.getLoginUserCode.value,
      passWord : this.getLoginPassword.value
    }
    

    this.subs.sink = this.adAccountService.login(loginDetails).subscribe(data =>{
      if(data && data.content && data.code == "00"){
        this.logedDetails = data.content;
        this.localStorageService.setItem('login',JSON.stringify(this.logedDetails));
        this.isLogginSuccess.emit(this.logedDetails.isLoginSuccess);
      }else{
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The entered credentials are incorrect.'});
      }
    })
  }
}
