import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { teacherVM } from '../shared/models/teachersVM';
import { TeacherService } from '../shared/services/teacher.service';
import { AdAccountServiceService } from '../shared/services/ad-account-service.service';
import { ADAccountVM } from '../shared/models/adAccountVM';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RoleService } from '../shared/services/role.service';
import { roleVM } from '../shared/models/roleVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';
import { LeaveRequestService } from '../shared/services/leave-request.service';
import { ApprovingStatusService } from '../shared/services/approving-status.service';
import { approvingStatusVM } from '../shared/models/approvingStatusVM';
import { leaveRequestVM } from '../shared/models/leaveRequestVM';
import { notificationVM } from '../shared/models/notificationVM';
import { NotificationService } from '../shared/services/notification.service';
import { EmailService } from '../shared/services/email.service';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-teachers',
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.css']
})
export class ManageTeachersComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  today = new Date();
  appIconId : number = 6
  isloading : boolean = false;
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  action : number = 1;
  teachersAllData : teacherVM[] = [];
  teachersTabelData : teacherVM[] = [];
  newTeacher : teacherVM = {}
  teacherLoginData : ADAccountVM | undefined
  isTeacherFormVisible : boolean = false;
  isTeacherUpdateFormVisible : boolean = false;
  selectedTeacher : teacherVM = {}
  role : roleVM|undefined
  teacherCreationForm !:FormGroup;
  teacherUpdateForm !:FormGroup;
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  approvingStatuses : approvingStatusVM[]=[];
  leaveRequestsaAll : leaveRequestVM[]=[]
  pendingLeaveRequestCount: number = 0;

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  // get teacher register values
  get getRegisterTeacherFullName(): AbstractControl { return this.teacherCreationForm.get('fullName') as AbstractControl; }
  get getRegisterTeacherTitle(): AbstractControl { return this.teacherCreationForm.get('title') as AbstractControl; }
  get getRegisterTeacherHighestQuli(): AbstractControl { return this.teacherCreationForm.get('highestQuli') as AbstractControl; }
  get getRegisterTeacherBirthday(): AbstractControl { return this.teacherCreationForm.get('birthday') as AbstractControl; }
  get getRegisterTeacherContactNumber(): AbstractControl { return this.teacherCreationForm.get('contactNumber') as AbstractControl; }
  get getRegisterTeacherEmail(): AbstractControl { return this.teacherCreationForm.get('email') as AbstractControl; }

  // get teacher register values
  get getUpdateTeacherFullName(): AbstractControl { return this.teacherUpdateForm.get('fullName') as AbstractControl; }
  get getUpdateTeacherTitle(): AbstractControl { return this.teacherUpdateForm.get('title') as AbstractControl; }
  get getUpdateTeacherHighestQuli(): AbstractControl { return this.teacherUpdateForm.get('highestQuli') as AbstractControl; }
  get getUpdateTeacherBirthday(): AbstractControl { return this.teacherUpdateForm.get('birthday') as AbstractControl; }
  get getUpdateTeacherContactNumber(): AbstractControl { return this.teacherUpdateForm.get('contactNumber') as AbstractControl; }
  get getUpdateTeacherEmail(): AbstractControl { return this.teacherUpdateForm.get('email') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private teachersService : TeacherService,
    private adAccountService : AdAccountServiceService,
    private confirmationService: ConfirmationService,
    private roleService : RoleService,
    private localStorageService : LocalStorageService,
    private leaveRequestService : LeaveRequestService,
    private approvingStatusService : ApprovingStatusService,
    private notificationService : NotificationService,
    private messageService: MessageService,
    private router : Router,
    private emailService : EmailService
  ){}

  ngOnInit(): void {
    this.getLoginData();
    this.buildForms()
    this.getTeachers()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
  }

  isActionAllowed(action : number):boolean{
    if(this.privilages.filter(el => el.appIcon.id == this.appIconId && el.action.id == action).length > 0){
      return true;
    }else{
      return false;
    }
  }

  buildForms(){
    this.selectAction = this.formBuilder.group({
      action : [1 , Validators.required]
    })

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.teacherCreationForm = this.formBuilder.group({
      fullName : ['', Validators.required],
      title : ['', Validators.required],
      highestQuli : ['',Validators.required],
      birthday : ['',Validators.required],
      contactNumber : ['',[Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      email : ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]

    })

    this.teacherUpdateForm = this.formBuilder.group({
      fullName : ['', Validators.required],
      title : ['', Validators.required],
      highestQuli : ['',Validators.required],
      birthday : ['',Validators.required],
      contactNumber : ['',[Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      email : ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]

    })
  }

  getTeachers(){
    let isprivilageHave : boolean;
    if(this.logedDetails){
      isprivilageHave = (this.logedDetails.privilagesDTO.filter(el => el.appIcon.id == this.appIconId).length > 0) ? true : false;
      if(isprivilageHave){
        this.isloading = true;
        this.subs.sink = this.teachersService.getTeachers().subscribe(data => {
          if(data){
            this.teachersAllData = data.content;
            this.teachersTabelData = this.teachersAllData;
            this.teachersTabelData.reverse();
            this.getRole();
          }
        })
      }else{
        alert('Not Allowed');
        this.router.navigate(['Dashboard']);
      }
    }else{
      alert('You are not logged in');
      this.router.navigate(['login']);
    }

    
  }

  getRole(){
    this.subs.sink = this.roleService.getRoles().subscribe(data =>{
      if(data && data.content){
        this.role = data.content.find(el => el.id && el.id == 4);
        this.getApprovingStatuses();
      }
    })
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
    this.subs.sink = this.leaveRequestService.getRequestByApprovingStatus(this.approvingStatuses[1]).subscribe(data =>{
      if(data && data.content){
        this.leaveRequestsaAll = data.content;
        this.pendingLeaveRequestCount = this.leaveRequestsaAll.length;
        this.isloading = false;
      }else{
        this.isloading = false;
      }
    })
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
  }

  openTeacherForm(teacherFormVisibility : boolean){
    this.isTeacherFormVisible = teacherFormVisibility;
  }

  searchTeacher(){
    this.teachersTabelData = this.teachersAllData.filter(el => el.tcode == this.getSearchValue.value)

    if(!(this.teachersTabelData.length > 0)){
      this.teachersTabelData = this.teachersAllData;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Teacher Code'});
    }
  }

  submitUpdateClick(){
    this.isloading = true;
    let teacher : teacherVM;
    let bd = new Date(this.getUpdateTeacherBirthday.value)
    let birthday : string = moment(bd).format("MM/DD/YYYY")

    teacher = {
      birthday : birthday,
      contactNumber : this.getUpdateTeacherContactNumber.value,
      email : this.getUpdateTeacherEmail.value,
      fullName : this.getUpdateTeacherFullName.value,
      highestQulification : this.getUpdateTeacherHighestQuli.value,
      id : this.selectedTeacher.id,
      isActive : this.selectedTeacher.isActive,
      tcode : this.selectedTeacher.tcode,
      title : this.getUpdateTeacherTitle.value,
      role : this.selectedTeacher.role
    }

    this.subs.sink = this.teachersService.updateTeacher(teacher).subscribe(data =>{
      if(data){
        this.teachersAllData.forEach((element, index) => {
          if(element.id == this.selectedTeacher.id){
            this.teachersAllData.splice(index,1,data.content);
          }
        });
        this.teachersTabelData = this.teachersAllData;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Teacher Details Updated' });
        this.isTeacherUpdateFormVisible = false;
        this.isloading = false;
      }
    })
  }

  reset(){
    this.teachersTabelData = this.teachersAllData;
  }

  submitClick(){
    this.isloading = true;
    let teacher : teacherVM;
    let tcode : string

    teacher = {
      birthday : this.getRegisterTeacherBirthday.value.toLocaleDateString(),
      contactNumber : this.getRegisterTeacherContactNumber.value,
      email : this.getRegisterTeacherEmail.value,
      fullName : this.getRegisterTeacherFullName.value,
      highestQulification : this.getRegisterTeacherHighestQuli.value,
      title : this.getRegisterTeacherTitle.value,
      isActive : true,
      role : this.role
    }

    this.subs.sink = this.teachersService.addTeacher(teacher).subscribe(data => {
      if(data){
        this.newTeacher = data?.content;
        this.teachersAllData.push(this.newTeacher);
        this.teachersTabelData = this.teachersAllData;
        this.teachersTabelData.reverse();
        this.createUserAccount(this.newTeacher);
        this.closeDialog();
        this.isloading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Teacher Registered' });
      }
    })
  }

  openUpdateForm(teacher : teacherVM){
    this.selectedTeacher = teacher;
    this.getUpdateTeacherBirthday.patchValue(teacher.birthday);
    this.getUpdateTeacherContactNumber.patchValue(teacher.contactNumber);
    this.getUpdateTeacherEmail.patchValue(teacher.email);
    this.getUpdateTeacherFullName.patchValue(teacher.fullName);
    this.getUpdateTeacherHighestQuli.patchValue(teacher.highestQulification);
    
    this.getUpdateTeacherTitle.patchValue(teacher.title);
    this.isTeacherUpdateFormVisible = true;
  }

  createUserAccount(teacher : teacherVM){
    let req : ADAccountVM;
    let usercode : string = teacher.tcode ? teacher.tcode : '';
    let defaultpassword : string = "teacher@1234"
    
    req = {
      userCode : usercode,
      passWord : defaultpassword
    }

    this.subs.sink = this.adAccountService.createUserAccount(req).subscribe(data =>{
      if(data){
        this.teacherLoginData = data.content
        
      }
    })
  }

  closeDialog(){
    this.teacherCreationForm.reset();
    this.isTeacherFormVisible = false;
  }

  closeUpdateDialog(){
    this.teacherUpdateForm.reset();
    this.isTeacherUpdateFormVisible = false;
  }

  deleteTeacher(teacherdata : teacherVM){
    let teacher : teacherVM;
    let delteacher : teacherVM;
    delteacher = teacherdata;
    
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () => {
        this.isloading = true;
        teacher = {
          ...delteacher,
          isActive : false
        }
    
        this.subs.sink = this.teachersService.deleteTeacher(teacher).subscribe(data =>{
          if(data){
            this.teachersAllData.forEach((element , index) => {
              if(element.id === teacherdata.id){
                this.teachersAllData.splice(index , 1);
                this.teachersTabelData = this.teachersAllData
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Teacher Removed' });
                this.isloading = false;
              }
            });
          }
        })
      }
  });
    
  }

  getDate(requestDate : string = ''){
    return requestDate.split('T')[0];
  }

  setStatusOnLeaves(req : leaveRequestVM, status : approvingStatusVM){
    this.isloading = true
    if(req && status && this.logedDetails?.usercode){
      let request : leaveRequestVM

      request ={
        ...req,
        approvingStatus : status,
        officerUserCode : this.logedDetails.usercode,
      }

      this.subs.sink = this.leaveRequestService.updateOrDeleteRequest(request).subscribe(data =>{
        if(data && data.content){
          let index : number = -1;
          let leave : leaveRequestVM | undefined;

          leave = this.leaveRequestsaAll.find(el => el.id == req.id);
          if(leave){
            index = this.leaveRequestsaAll.indexOf(leave);
            this.leaveRequestsaAll.splice(index,1);
            this.isloading = false;
          }

          if(status.id == 1 ){
            this.setNotification(data.content)
          }else{
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Leave Rejected'});
          }
        }
      })
    }
  }

  setNotification(leave : leaveRequestVM){
    let notification : notificationVM;
    let message : string;
    let teacherId: number = leave.teacher?.id ? leave.teacher?.id : 0;

    message = `${leave.teacher?.title}.${leave.teacher?.fullName} is on leave on ${leave.requestedDate?.split('T')[0]}. So all the classes on that day will be canceled.`

    notification = {
      createdDateTime : this.today.toLocaleDateString(),
      createdUserCode : this.logedDetails?.usercode,
      message : message,
      isActive : true
    }

    this.subs.sink = this.notificationService.addNotification(notification).subscribe(data =>{
      if(data && data.content){
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Leave Accepted' });
        this.sendEmail(message,teacherId)
      }
    })
  }

  sendEmail(message : string, teacherId: number){
    this.subs.sink = this.emailService.sendEmail(message, teacherId).subscribe(data =>{
      
    })
  }
  
}
