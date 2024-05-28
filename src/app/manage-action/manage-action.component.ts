import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { SubSink } from 'subsink';
import { actionVM } from '../shared/models/actionVM';
import { ActionService } from '../shared/services/action.service';

@Component({
  selector: 'app-manage-action',
  templateUrl: './manage-action.component.html',
  styleUrls: ['./manage-action.component.css']
})
export class ManageActionComponent  implements OnInit, OnDestroy{

  isLoading : boolean = false;
  private subs = new SubSink();
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  actionCreationForm !:FormGroup;
  actionUpdateForm !:FormGroup;
  action : number =1;
  isCreateActionFormButtonVisible: boolean = false
  isActionFormVisible : boolean = false;
  isActionUpdateFormVisible : boolean = false;
  newlyAddedAction : actionVM | undefined;
  allAction : actionVM[] = [] 
  updatingAction : actionVM | undefined;
  tableAction : actionVM[] = [] 

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }
  
  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  // get app icone creation value
  get getActionCreationName(): AbstractControl { return this.actionCreationForm.get('name') as AbstractControl; }

  // get app icon update value
  get getActionUpdateName(): AbstractControl { return this.actionUpdateForm.get('name') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
    private actionService : ActionService,
    private confirmationService: ConfirmationService
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.buildForm();
    this.getActions()
  }

  buildForm(){
    this.selectAction = this.formBuilder.group({
      action : [1 , Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.actionCreationForm = this.formBuilder.group({
      name : ['',Validators.required]
    })

    this.actionUpdateForm = this.formBuilder.group({
      name : ['',Validators.required]
    })
  }

  getActions(){
    this.subs.sink = this.actionService.getActions().subscribe(data =>{
      if(data && data.content){
        this.allAction = data.content;
        this.tableAction = this.allAction;
      }
    })
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isCreateActionFormButtonVisible = false;
    }
  }

  openAppIconForm(actionFormVisibility : boolean){
    this.isActionFormVisible = actionFormVisibility;
  }

  searchAction(){
    this.tableAction = this.allAction.filter(el => el.name && el.name.startsWith(this.getSearchValue.value));
  }

  reset(){
    this.searchForm.reset();
    this.tableAction = this.allAction;
  }

  closeAppIconCreatePopup(){
    this.actionCreationForm.reset();
    this.isActionFormVisible = false;
  }

  closeAppIconUpdatePopup(){
    this.actionUpdateForm.reset();
    this.isActionUpdateFormVisible = false;
  }

  updateClick(){
    this.isLoading = true
    let action : actionVM;
    let updatedAction : actionVM;
    action = {
      ...this.updatingAction,
      name : this.getActionUpdateName.value
    }

    this.subs.sink = this.actionService.updateOrDeleteAction(action).subscribe(data =>{
      if(data && data.content && this.updatingAction){
        updatedAction = data.content;
        let index : number;
        index = this.allAction.indexOf(this.updatingAction);
        this.allAction.splice(index,1,updatedAction);
        this.tableAction = this.allAction;
        this.closeAppIconUpdatePopup();
        this.isLoading = false;
      }
    })
  }

  submitClick(){
    this.isLoading = true;
    let action : actionVM;
    action = {
      isActive : true,
      name : this.getActionCreationName.value
    }

    this.subs.sink = this.actionService.addAction(action).subscribe(data =>{
      if(data && data.content){
        this.newlyAddedAction = data.content;
        console.log(this.newlyAddedAction);
        this.allAction.push(this.newlyAddedAction);
        this.tableAction = this.allAction
        this.closeAppIconCreatePopup();
        this.isLoading = false;
      }
    })
  }

  openUpdateForm(action : actionVM){
    this.updatingAction = action
    this.getActionUpdateName.patchValue(this.updatingAction.name)
    this.isActionUpdateFormVisible = true;
  }

  deleteAction(action : actionVM){
    let selectedAction : actionVM = action;
    let delAction : actionVM;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () =>{
        this.isLoading = true;

        delAction = {
          ...selectedAction,
          isActive : false
        }

        this.subs.sink = this.actionService.updateOrDeleteAction(delAction).subscribe(data =>{
          if(data && data.content){
            let updatedAction : actionVM;
            updatedAction = data.content;
            let index : number;
            index = this.allAction.indexOf(selectedAction);
            this.allAction.splice(index,1);
            this.isLoading = false;
          }
        })
      }
    })
  }

}
