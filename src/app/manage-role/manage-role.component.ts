import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { SubSink } from 'subsink';
import { RoleService } from '../shared/services/role.service';
import { roleVM } from '../shared/models/roleVM';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.css']
})
export class ManageRoleComponent implements OnInit, OnDestroy {

  isLoading : boolean = false;
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  roleCreationForm !:FormGroup;
  roleUpdateForm !:FormGroup;
  action : number =1;
  isCreateRoleFormButtonVisible : boolean = false;
  private subs = new SubSink();
  allRoles : roleVM[]=[];
  tableRoles : roleVM[]=[];
  isRoleFormVisible : boolean = false;
  isRoleUpdateFormVisible : boolean = false;
  newlyAddedRole : roleVM | undefined;
  updatingRole : roleVM | undefined;
  deletingRole : roleVM | undefined;
  updatedRole : roleVM | undefined;
  deletedRole : roleVM | undefined;

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }
  
  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  // get Creation Form value
  get getRoleCreationnName(): AbstractControl { return this.roleCreationForm.get('name') as AbstractControl; }

  // get update Form value
  get getRoleUpdateName(): AbstractControl { return this.roleUpdateForm.get('name') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private roleService : RoleService,
    private confirmationService: ConfirmationService
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getRoles()
  }

  getRoles(){
    this.isLoading = true
    this.subs.sink = this.roleService.getRoles().subscribe(data =>{
      if(data && data.content){
        this.allRoles = data.content
        this.tableRoles = this.allRoles;
        this.isLoading = false
      }
    })
  }

  buildForm(){
    this.selectAction = this.formBuilder.group({
      action : [1 , Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.roleCreationForm = this.formBuilder.group({
      name : ['',Validators.required]
    })

    this.roleUpdateForm = this.formBuilder.group({
      name : ['',Validators.required]
    })
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isCreateRoleFormButtonVisible = false;
    }
  }

  openRoleForm(roleFormVisibility : boolean){
    this.isRoleFormVisible = roleFormVisibility;
  }

  searchRole(){
    this.tableRoles = this.allRoles.filter(el => el.name && this.getSearchValue.value && el.name.startsWith(this.getSearchValue.value));
  }

  reset(){
    this.tableRoles = this.allRoles;
  }

  closeHallUpdatePopup(){
    this.roleCreationForm.reset();
    this.roleUpdateForm.reset();
  }

  submitClick(){
    this.isLoading = true;
    let role : roleVM;
    role = {
      name : this.getRoleCreationnName.value,
      isActive : true
    }

    this.subs.sink = this.roleService.addRole(role).subscribe(data =>{
      if(data && data.content){
        this.newlyAddedRole = data.content
        console.log(this.newlyAddedRole);
        this.allRoles.push(this.newlyAddedRole);
        this.tableRoles = this.allRoles;
        this.isRoleFormVisible = false;
        this.isLoading = false;
      }
    })
  }

  updateClick(){
    if(this.updatingRole){
      this.isLoading = true;
      let r : roleVM = this.updatingRole
      let role : roleVM;
      role = {
        ...r,
        name : this.getRoleUpdateName.value
      }
      this.subs.sink = this.roleService.updateAndDeleteRole(role).subscribe(data =>{
        if(data && data.content){
          this.updatedRole = data.content
          let index : number;
          index = this.allRoles.indexOf(r);
          if(index && this.updatedRole){
            this.allRoles.splice(index,1, this.updatedRole);
            this.tableRoles = this.allRoles;
            this.roleUpdateForm.reset();
            this.isRoleUpdateFormVisible = false;
            this.isLoading = false;
          }
        }
      })
    }
  }

  openUpdateForm(role : roleVM){
    this.updatingRole = role;
    this.isRoleUpdateFormVisible = true
    this.getRoleUpdateName.patchValue(role.name);
  }

  deleteGrade(role : roleVM){
    let selectedRole : roleVM = role;
    let delRole : roleVM;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () =>{
        this.isLoading = true;

        delRole = {
          ...selectedRole,
          isActive : false
        }

        this.subs.sink = this.roleService.updateAndDeleteRole(delRole).subscribe(data =>{
          if(data && data.content){
            let index : number;
            index = this.allRoles.indexOf(selectedRole);
            if(index){
              this.allRoles.splice(index,1);
              this.tableRoles = this.allRoles;
              this.isLoading = false;
            }
          }
        })
      }
    })
  }
}
