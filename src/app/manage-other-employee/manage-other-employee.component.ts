import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AdAccountServiceService } from '../shared/services/ad-account-service.service';
import { SubSink } from 'subsink';
import { RoleService } from '../shared/services/role.service';
import { roleVM } from '../shared/models/roleVM';
import { OtherEmployeeService } from '../shared/services/other-employee.service';
import { otherEmployeeVM } from '../shared/models/oterEmployeeVM';
import { ADAccountVM } from '../shared/models/adAccountVM';

@Component({
  selector: 'app-manage-other-employee',
  templateUrl: './manage-other-employee.component.html',
  styleUrls: ['./manage-other-employee.component.css']
})
export class ManageOtherEmployeeComponent implements OnInit, OnDestroy{

  private subs = new SubSink();
  isloading : boolean = false;
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  action : number = 2;
  employeeCreationForm !:FormGroup;
  employeeUpdateForm !:FormGroup;
  isEmployeeFormVisible : boolean = false;
  isTeacherUpdateFormVisible : boolean = false;
  roles : roleVM[] = [];
  otherEmployeeLoginData : ADAccountVM | undefined
  newlyAddedOtherEmployee : otherEmployeeVM | undefined;
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

  constructor(
    private formBuilder: FormBuilder,
    private roleService : RoleService,
    private otherEmployeeService : OtherEmployeeService,
    private adAccountService : AdAccountServiceService,
    private confirmationService: ConfirmationService
  ){}

  ngOnInit(): void {
    this.buildForms()
    this.getEmployee()
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getEmployee(){
    this.getRoles()
  }

  getRoles(){
    this.subs.sink = this.roleService.getRoles().subscribe(data =>{
      if(data && data.content){
        let roles = data.content;
        this.roles = roles.filter(el => el.id == 2 || el.id == 3 || el.id == 5);
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
    // this.teachersTabelData = this.teachersAllData.filter(el => el.tcode == this.getSearchValue.value)
  }

  closeDialog(){

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
