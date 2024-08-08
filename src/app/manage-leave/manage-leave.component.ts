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
import { ConfirmationService } from 'primeng/api';
import * as moment from 'moment';

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
    private confirmationService: ConfirmationService,
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
      date : [null,Validators.required],
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

   openRequestFormFom(hallFormVisibility : boolean){
    this.isRequestFormVisible = hallFormVisibility;
  }

  searchLeaveRequest(){
    let date : string;
    date = moment(this.getSearchValue.value).format("YYYY-MM-DD")
    
    this.leaveRequestsaShow = this.leaveRequestsaAll.filter(el => el && el.requestedDate && el.requestedDate.split('T')[0] == date);
  }

  reset(){
    this.leaveRequestsaShow = this.leaveRequestsaAll;
    this.searchForm.reset();
  }

  closeLeaveRequestPopUp(){
    this.requestForm.reset()
    this.isRequestFormVisible = false;
  }

  submitClick(){
    let req : leaveRequestVM | undefined;
    let reqDate = new Date(this.getRequestDate.value)
    let zero = '0';
    let date = reqDate.getDate();
    let year = reqDate.getFullYear();
    let month = reqDate.getMonth();
    let requestDate : string;
    requestDate = `${year}-${month>=10 ? month : zero+month}-${date>=10 ? date : zero+date}T00:00:01.000Z`
    console.log("requestDater",requestDate);
    
    
    

    if(this.teacher){
      req = {
        teacher : this.teacher,
        requestedDate : requestDate,
        approvingStatus : this.approvingStatuses.find(el => el.id == 2),
        leaveReason : this.getRequestReason.value,
        isActive : true
      }
    }

    if(req){
      this.subs.sink = this.leaveRequestService.makeRequest(req).subscribe(data =>{
        if(data && data.content){
          this.leaveRequestsaAll.unshift(data.content);
          
          this.closeLeaveRequestPopUp()
        }
      })
    }
  }

  getDate(requestDate : string = ''){
    return requestDate.split('T')[0];
  }

  deleteLeave(leave : leaveRequestVM){
    let leaveReq : leaveRequestVM

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () => {
        this.isLoading = true;
        leaveReq = {
          ...leave,
          isActive : false,
          approvingStatus : this.approvingStatuses[2]
        }

        this.subs.sink = this.leaveRequestService.updateOrDeleteRequest(leaveReq).subscribe(data =>{
          if(data){
            let index = this.leaveRequestsaAll.indexOf(leave);
    
            this.leaveRequestsaAll.splice(index,1);
            this.leaveRequestsaShow = this.leaveRequestsaAll
            this.isLoading = false;
          }
        })
      }
    })
  }
}
