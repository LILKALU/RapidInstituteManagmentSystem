import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { TeacherService } from '../shared/services/teacher.service';
import { teacherVM } from '../shared/models/teachersVM';
import { LeaveRequestService } from '../shared/services/leave-request.service';
import { leaveRequestVM } from '../shared/models/leaveRequestVM';
import { ApprovingStatusService } from '../shared/services/approving-status.service';
import { approvingStatusVM } from '../shared/models/approvingStatusVM';

@Component({
  selector: 'app-manage-leave',
  templateUrl: './manage-leave.component.html',
  styleUrls: ['./manage-leave.component.css']
})
export class ManageLeaveComponent implements OnInit, OnDestroy {

  today = new Date();
  isLoading : boolean = false;
  selectAction !: FormGroup
  searchForm !: FormGroup;
  appIconId : number = 18
  userCode : string = '';
  private subs = new SubSink();
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  action : number | undefined
  isRequestCreateButtonVisible : boolean = false;
  isRequestFormVisible : boolean = false;
  teacher : teacherVM | undefined;
  requestForm !: FormGroup;
  approvingStatuses : approvingStatusVM[]=[];
  leaveRequestsaAll : leaveRequestVM[]=[]
  leaveRequestsaShow : leaveRequestVM[]=[]

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  get getRequestDate(): AbstractControl { return this.requestForm.get('date') as AbstractControl; }
  get getRequestReason(): AbstractControl { return this.requestForm.get('reason') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private localStorageService : LocalStorageService,
    private teachersService : TeacherService,
    private leaveRequestService : LeaveRequestService,
    private approvingStatusService : ApprovingStatusService,
    private router : Router
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getLoginData();
    this.buildForm();
    this.subscription()
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    console.log("this.logedDetails",this.logedDetails);
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
    this.userCode = this.logedDetails?.usercode ? this.logedDetails?.usercode : '';
  }

  isActionAllowed(action : number):boolean{
    if(this.privilages.filter(el => el.appIcon.id == this.appIconId && el.action.id == action).length > 0){
      return true;
    }else{
      return false;
    }
  }

  buildForm(){
    this.selectAction = this.formBuilder.group({
      action : ['' , Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.requestForm = this.formBuilder.group({
      date : ['',Validators.required],
      reason : ['',Validators.required]
    })
  }

  subscription(){
    let isprivilageHave : boolean;
    if(this.logedDetails){
      isprivilageHave = (this.logedDetails.privilagesDTO.filter(el => el.appIcon.id == this.appIconId).length > 0) ? true : false;
      if(isprivilageHave){
        this.isLoading = true;
        if(this.userCode.startsWith('T')){
          this.subs.sink = this.teachersService.getTeacher(this.userCode).subscribe(data =>{
            if(data && data.content){
              this.teacher = data.content
              this.getApprovingStatuses()
              console.log("teacher",data.content);
            }
          })
        }else{
          this.getApprovingStatuses()
        }
      }else{
        alert('Not Allowed');
        this.router.navigate(['Dashboard']);
      }
    }else{
      alert('You are not logged in');
      this.router.navigate(['login']);
    }
    
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isRequestCreateButtonVisible = false;
    }
  }

  getApprovingStatuses(){
    this.subs.sink = this.approvingStatusService.getApprovingStatuses().subscribe(data =>{
      if(data && data.content){
        this.approvingStatuses = data.content
        this.getLeaveRequests()
      }
    })
  }

  getLeaveRequests(){
    this.subs.sink = this.leaveRequestService.getRequest(this.userCode).subscribe(data =>{
      if(data && data.content){
        this.leaveRequestsaAll = data.content;
        this.leaveRequestsaShow = this.leaveRequestsaAll
        this.isLoading = false;
      }else{
        this.isLoading = false;
      }
    })
  }

  openRequestFormFo(hallFormVisibility : boolean){
    this.isRequestFormVisible = hallFormVisibility;
  }

  searchLeaveRequest(){

  }

  closeLeaveRequestPopUp(){
    this.requestForm.reset()
    this.isRequestFormVisible = false;
  }

  submitClick(){
    let req : leaveRequestVM | undefined;
    console.log(typeof this.getRequestDate.value);
    

    if(this.teacher){
      req = {
        teacher : this.teacher,
        requestedDate : this.getRequestDate.value,
        approvingStatus : this.approvingStatuses.find(el => el.id == 2),
        leaveReason : this.getRequestReason.value,
        isActive : true
      }
    }

    if(req){
      this.subs.sink = this.leaveRequestService.makeRequest(req).subscribe(data =>{
        if(data && data.content){
          console.log(data.content);
          this.leaveRequestsaAll.push(data.content)
          this.closeLeaveRequestPopUp()
        }
      })
    }
  }

  getDate(requestDate : string = ''){
    return requestDate.split('T')[0];
  }
}
