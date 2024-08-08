import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdAccountServiceService } from '../shared/services/ad-account-service.service';
import { SubSink } from 'subsink';
import { RoleService } from '../shared/services/role.service';
import { roleVM } from '../shared/models/roleVM';
import { OtherEmployeeService } from '../shared/services/other-employee.service';
import { otherEmployeeVM } from '../shared/models/oterEmployeeVM';
import { ADAccountVM } from '../shared/models/adAccountVM';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-other-employee',
  templateUrl: './manage-other-employee.component.html',
  styleUrls: ['./manage-other-employee.component.css']
})
export class ManageOtherEmployeeComponent implements OnInit, OnDestroy{

  private subs = new SubSink();
  appIconId : number = 12
  isloading : boolean = false;
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  action : number = 2;
  employeeCreationForm !:FormGroup;
  employeeUpdateForm !:FormGroup;
  isEmployeeFormVisible : boolean = false;
  isEmployeeFormUpdateVisible : boolean = false;
  roles : roleVM[] = [];
  otherEmployeeLoginData : ADAccountVM | undefined
  newlyAddedOtherEmployee : otherEmployeeVM | undefined;
  allOtherEmployees : otherEmployeeVM[] =[];
  tableOtherEmployees : otherEmployeeVM[] =[];
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];
  updatingEmployee : otherEmployeeVM | undefined;
  // teachersAllData : teacherVM[] = [];
  // teachersTabelData : teacherVM[] = [];

    // get action value
    get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

    // get search value
    get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

    // get employee register value
    get getEmployeeCreationRole(): AbstractControl { return this.employeeCreationForm.get('role') as AbstractControl; }
    get getEmployeeCreationFullName(): AbstractControl { return this.employeeCreationForm.get('fullName') as AbstractControl; }
    get getEmployeeCreationTitle(): AbstractControl { return this.employeeCreationForm.get('title') as AbstractControl; }
    get getEmployeeCreationContactNumber(): AbstractControl { return this.employeeCreationForm.get('contactNumber') as AbstractControl; }
    get getEmployeeCreationEmail(): AbstractControl { return this.employeeCreationForm.get('email') as AbstractControl; }

    // get employee register value
    get getEmployeeCreationUpdateRole(): AbstractControl { return this.employeeUpdateForm.get('role') as AbstractControl; }
    get getEmployeeCreationUpdateFullName(): AbstractControl { return this.employeeUpdateForm.get('fullName') as AbstractControl; }
    get getEmployeeCreationUpdateTitle(): AbstractControl { return this.employeeUpdateForm.get('title') as AbstractControl; }
    get getEmployeeCreationUpdateContactNumber(): AbstractControl { return this.employeeUpdateForm.get('contactNumber') as AbstractControl; }
    get getEmployeeCreationUpdateEmail(): AbstractControl { return this.employeeUpdateForm.get('email') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private roleService : RoleService,
    private otherEmployeeService : OtherEmployeeService,
    private adAccountService : AdAccountServiceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private localStorageService : LocalStorageService,
    private router : Router
  ){}

  ngOnInit(): void {
    this.getLoginData();
    this.buildForms()
    this.subscription();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  subscription(){
    let isprivilageHave : boolean;
    if(this.logedDetails){
      isprivilageHave = (this.logedDetails.privilagesDTO.filter(el => el.appIcon.id == this.appIconId).length > 0) ? true : false;
      if(isprivilageHave){
        this.isloading = true
        this.getEmployee();
      }else{
        alert('Not Allowed');
        this.router.navigate(['Dashboard']);
      }
    }else{
      alert('You are not logged in');
      this.router.navigate(['login']);
    }
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

  getEmployee(){
    this.subs.sink = this.otherEmployeeService.getOtherEmployees().subscribe(data =>{
      if(data && data.content){
        this.allOtherEmployees = data.content;
        this.tableOtherEmployees = this.allOtherEmployees;
        this.getRoles()
      }
    })
  }

  getRoles(){
    this.subs.sink = this.roleService.getRoles().subscribe(data =>{
      if(data && data.content){
        let roles = data.content;
        this.roles = roles.filter(el => el.id == 2 || el.id == 3 || el.id == 5);
        this.isloading = false
      }
    })
  }

  buildForms(){
    this.selectAction = this.formBuilder.group({
      action : [2 , Validators.required]
    })

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.employeeCreationForm = this.formBuilder.group({
      role : [null, Validators.required],
      fullName : ['',Validators.required],
      title : ['', Validators.required],
      contactNumber : ['',[Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      email : ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]

    })

    this.employeeUpdateForm = this.formBuilder.group({
      role : [null, Validators.required],
      fullName : ['',Validators.required],
      title : ['', Validators.required],
      contactNumber : ['',[Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      email : ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]

    })
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
  }

  openEmployeeForm(teacherFormVisibility : boolean){
    this.isEmployeeFormVisible = teacherFormVisibility;
  }

  searchEmployee(){
    this.tableOtherEmployees = this.allOtherEmployees.filter(el => el.fcode == this.getSearchValue.value || el.syscode == this.getSearchValue.value || el.mcode == this.getSearchValue.value)

    if(!(this.tableOtherEmployees.length > 0)){
      this.tableOtherEmployees = this.allOtherEmployees;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Employee Code'});
    }
  }

  reset(){
    this.tableOtherEmployees = this.allOtherEmployees;
  }

  closeDialog(){
    this.employeeCreationForm.reset();
    this.isEmployeeFormVisible = false;
  }

  closeUpdateDialog(){
    this.employeeUpdateForm.reset();
    this.isEmployeeFormUpdateVisible = false;
  }

  openUpdateForm(otherEmpData : otherEmployeeVM){
    this.getEmployeeCreationUpdateContactNumber.patchValue(otherEmpData.contactNumber);
    this.getEmployeeCreationUpdateEmail.patchValue(otherEmpData.email);
    this.getEmployeeCreationUpdateFullName.patchValue(otherEmpData.fullName);
    this.getEmployeeCreationUpdateRole.patchValue(otherEmpData.roleId);
    this.getEmployeeCreationUpdateTitle.patchValue(otherEmpData.title)

    this.updatingEmployee = otherEmpData;
    this.isEmployeeFormUpdateVisible = true;
  }

  getCode(otherEmpData : otherEmployeeVM): string{
    if(otherEmpData.fcode){
      return otherEmpData.fcode
    }else if(otherEmpData.syscode){
      return otherEmpData.syscode
    }else if(otherEmpData.mcode){
      return otherEmpData.mcode
    }else{
      return ''
    }
  }

  getPosition(otherEmpData : otherEmployeeVM): string{
    if(otherEmpData.fcode){
      return 'Front Desk Officer'
    }else if(otherEmpData.syscode){
      return 'System Administrator'
    }else if(otherEmpData.mcode){
      return 'Manager'
    }else{
      return ''
    }
  }

  updateClick(){
    this.isloading = true;
    let otherEmployee : otherEmployeeVM;

    otherEmployee = {
      id : this.updatingEmployee?.id,
      contactNumber : this.getEmployeeCreationUpdateContactNumber.value,
      email : this.getEmployeeCreationUpdateEmail.value,
      fullName : this.getEmployeeCreationUpdateFullName.value,
      roleId : this.getEmployeeCreationUpdateRole.value,
      title : this.getEmployeeCreationUpdateTitle.value,
      fcode : this.updatingEmployee?.fcode,
      mcode : this.updatingEmployee?.mcode,
      syscode : this.updatingEmployee?.syscode,
      isActive : true,
      role : this.updatingEmployee?.role
    }

    this.subs.sink = this.otherEmployeeService.updateOrDeleteEmployee(otherEmployee).subscribe(data =>{
      if(data && data.content){
        let updatedEmployee : otherEmployeeVM;
        updatedEmployee = data.content;
        this.allOtherEmployees.forEach((element,index) => {
          if(updatedEmployee.fcode && element.fcode == updatedEmployee.fcode){
            this.allOtherEmployees.splice(index,1,updatedEmployee);
            this.tableOtherEmployees = this.allOtherEmployees;
          }else if(updatedEmployee.mcode && element.mcode == updatedEmployee.mcode){
            this.allOtherEmployees.splice(index,1,updatedEmployee);
            this.tableOtherEmployees = this.allOtherEmployees;
          }else if(updatedEmployee.syscode && element.syscode == updatedEmployee.syscode){
            this.allOtherEmployees.splice(index,1,updatedEmployee);
            this.tableOtherEmployees = this.allOtherEmployees;
          }
        });
        this.isEmployeeFormUpdateVisible = false;
        this.isloading = false;
      }
    })
  }

  
  deleteHall(otherEmpData : otherEmployeeVM){
    let otherEmp : otherEmployeeVM = otherEmpData;

    let delotherEmp : otherEmployeeVM;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () => {
        this.isloading = true;
        delotherEmp = {
          ...otherEmp,
          isActive : false
        }

        this.subs.sink = this.otherEmployeeService.updateOrDeleteEmployee(delotherEmp).subscribe(data =>{
          if(data && data.content){
            let deletedEmployee : otherEmployeeVM;
            deletedEmployee = data.content;
            this.allOtherEmployees.forEach((element,index) => {
              if(deletedEmployee.fcode && element.fcode == deletedEmployee.fcode){
                this.allOtherEmployees.splice(index,1);
                this.tableOtherEmployees = this.allOtherEmployees;
              }else if(deletedEmployee.mcode && element.mcode == deletedEmployee.mcode){
                this.allOtherEmployees.splice(index,1);
                this.tableOtherEmployees = this.allOtherEmployees;
              }else if(deletedEmployee.syscode && element.syscode == deletedEmployee.syscode){
                this.allOtherEmployees.splice(index,1);
                this.tableOtherEmployees = this.allOtherEmployees;
              }
            });
            this.isEmployeeFormUpdateVisible = false;
            this.isloading = false;
          }
        })
      }
    })
  }

  submitClick(){
    this.isloading = true;
    let otherEmployee : otherEmployeeVM;

    otherEmployee = {
      contactNumber : this.getEmployeeCreationContactNumber.value,
      email : this.getEmployeeCreationEmail.value,
      fullName : this.getEmployeeCreationFullName.value,
      roleId : this.getEmployeeCreationRole.value,
      title : this.getEmployeeCreationTitle.value,
      isActive : true
    }
    
    this.subs.sink = this.otherEmployeeService.addOtherEmployee(otherEmployee).subscribe(data =>{
      if(data && data.content){
        this.newlyAddedOtherEmployee = {
          ...data.content,
          roleId : this.getEmployeeCreationRole.value
        }

        this.createUserAccount(this.newlyAddedOtherEmployee);
      }
    })
  }

  createUserAccount(otherEmployee : otherEmployeeVM){
    if(otherEmployee && otherEmployee.fcode && otherEmployee.roleId && otherEmployee.roleId == 2){
      let passWord : string = 'FrontDesk@123';
      let usercode : string = otherEmployee.fcode
      let req : ADAccountVM;
      

      req = {
        userCode : usercode,
        passWord : passWord
      }

      this.subs.sink = this.adAccountService.createUserAccount(req).subscribe(data =>{
        if(data && data.content){
          this.otherEmployeeLoginData = data.content;
          this.isloading = false;
        }
      })
    }else if(otherEmployee && otherEmployee.mcode && otherEmployee.roleId && otherEmployee.roleId == 3){
      let passWord : string = 'Man@123';
      let usercode : string = otherEmployee.mcode
      let req : ADAccountVM;

      req = {
        userCode : usercode,
        passWord : passWord
      }

      this.subs.sink = this.adAccountService.createUserAccount(req).subscribe(data =>{
        if(data && data.content){
          this.otherEmployeeLoginData = data.content;
          this.isloading = false;
        }
      })
    }else if(otherEmployee && otherEmployee.syscode){
      let passWord : string = 'Sys@123';
      let usercode : string = otherEmployee.syscode
      let req : ADAccountVM;

      req = {
        userCode : usercode,
        passWord : passWord
      }

      this.subs.sink = this.adAccountService.createUserAccount(req).subscribe(data =>{
        if(data && data.content){
          this.otherEmployeeLoginData = data.content;
          this.isloading = false;
        }
      })

    }
  }
}
