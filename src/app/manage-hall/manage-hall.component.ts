import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { HallVM } from '../shared/models/hallVM';
import { HallServiceService } from '../shared/services/hall-service.service';
import { ConfirmationService } from 'primeng/api';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-hall',
  templateUrl: './manage-hall.component.html',
  styleUrls: ['./manage-hall.component.css']
})
export class ManageHallComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  isLoading : boolean = false;
  appIconId : number = 4
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  hallCreationForm !: FormGroup;
  hallUpdateForm !: FormGroup;
  action : number | undefined
  isCreateHallFormButtonVisible : boolean = false;
  isHallFormVisible : boolean = false;
  selectedHall : HallVM = {};
  updateedHall : HallVM = {};
  deletedHall : HallVM = {};
  isHallUpdateFormVisible : boolean = false;
  newHall : HallVM = {}
  hallAllData : HallVM[] = [];
  hallTableData : HallVM[] = [];
  logedDetails : loginDetailsVM | undefined;
  privilages : privilagesVM[] = [];

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }

  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  // get hall creation form value 
  get getHallCreationhallName(): AbstractControl {return this.hallCreationForm.get('hallName') as AbstractControl}
  get getHallCreationIsAc(): AbstractControl {return this.hallCreationForm.get('isAc') as AbstractControl}
  get getHallCreationNumberOfChairs(): AbstractControl {return this.hallCreationForm.get('numberOfChairs') as AbstractControl}
  get getHallCreationNumberOfDesks(): AbstractControl {return this.hallCreationForm.get('numberOfDesks') as AbstractControl}
  get getHallCreationCapacity(): AbstractControl {return this.hallCreationForm.get('capacity') as AbstractControl}

  // get hall update form value
  get getHallUpdatehallName(): AbstractControl {return this.hallUpdateForm.get('hallName') as AbstractControl}
  get getHallUpdateNumberOfChairs(): AbstractControl {return this.hallUpdateForm.get('numberOfChairs') as AbstractControl}
  get getHallUpdateNumberOfDesks(): AbstractControl {return this.hallUpdateForm.get('numberOfDesks') as AbstractControl}
  get getHallUpdateCapacity(): AbstractControl {return this.hallUpdateForm.get('capacity') as AbstractControl}
  get getHallUpdateIsAC(): AbstractControl {return this.hallUpdateForm.get('isAc') as AbstractControl}


  constructor(
    private formBuilder: FormBuilder,
    private hallService : HallServiceService,
    private confirmationService: ConfirmationService,
    private localStorageService : LocalStorageService,
    private router : Router
  ){}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.getLoginData();
    this.buildForm();
    this.subscription();
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

  buildForm(){
    this.selectAction = this.formBuilder.group({
      action : ['' , Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.hallCreationForm = this.formBuilder.group({
      hallName : ['',Validators.required],
      isAc : ['false' , Validators.required],
      numberOfChairs : [1, [Validators.required]],
      numberOfDesks : [1, [Validators.required]],
      capacity : [1, [Validators.required]],
    })

    this.hallUpdateForm = this.formBuilder.group({
      hallName : ['',Validators.required],
      isAc : ['false' , Validators.required],
      numberOfChairs : [1, [Validators.required]],
      numberOfDesks : [1, [Validators.required]],
      capacity : [1, [Validators.required]],
    })
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isCreateHallFormButtonVisible = false;
    }
  }

  searchHall(){
    this.hallTableData = this.hallAllData.filter(el => el.hallName == this.getSearchValue.value);
  }

  reset(){
    this.hallTableData = this.hallAllData;
  }

  subscription(){
    let isprivilageHave : boolean;
    if(this.logedDetails){
      isprivilageHave = (this.logedDetails.privilagesDTO.filter(el => el.appIcon.id == this.appIconId).length > 0) ? true : false;
      if(isprivilageHave){
        this.isLoading = true;
        this.subs.sink = this.hallService.getHalls().subscribe(data =>{
          if(data){
            this.isLoading = false;
            this.hallAllData = data.content;
            this.hallTableData = this.hallAllData;
            this.hallTableData.reverse();
            
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

  openHallForm(hallFormVisibility : boolean){
    this.isHallFormVisible = hallFormVisibility;
  }

  closeHallCreationPopup(){
    this.hallCreationForm.reset();
    this.isHallFormVisible = false;
  }

  closeHallUpdatePopup(){
    this.hallUpdateForm.reset();
    this.isHallFormVisible = false;
  }

  submitUpdateClick(){
    this.isLoading = true;
    let hall : HallVM = {
      capacity : this.getHallUpdateCapacity.value,
      hallName : this.getHallUpdatehallName.value,
      id : this.selectedHall.id,
      isAC : this.getHallUpdateIsAC.value,
      isActive : true,
      numberOfChairs : this.getHallUpdateNumberOfChairs.value,
      numberOfDesks : this.getHallUpdateNumberOfDesks.value,
    }

    this.subs.sink = this.hallService.updateHall(hall).subscribe(data =>{
      if(data){
        this.updateedHall = data.content;
        this.hallAllData.forEach((element , index) => {
          if(this.updateedHall.id == element.id){
            this.hallAllData.splice(index , 1 , data.content);
            this.hallTableData = this.hallAllData;
          }
        });
        this.hallUpdateForm.reset();
        this.isHallUpdateFormVisible = false;
        this.isLoading = false;
      }
    })
  }

  deleteHall(halldata : HallVM){
    let hall : HallVM = halldata;

    let delHall : HallVM;

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () => {
        this.isLoading = true;
        delHall = {
          ...hall,
          isActive : false
        }
    
        this.subs.sink = this.hallService.deleteHall(delHall).subscribe(data =>{
          if(data){
            this.deletedHall = data.content
            this.hallAllData.forEach((element,index) => {
              if(element.id == hall.id){
                this.hallAllData.splice(index , 1);
              }
            });
            this.hallTableData = this.hallAllData
            this.isLoading = false;
          }
        })
      }
  });
  }

  openUpdateForm(halldata : HallVM){
    this.selectedHall = halldata;
    let isac : boolean = halldata.isAC ? halldata?.isAC : false;
    this.getHallUpdateCapacity.patchValue(halldata.capacity);
    this.getHallUpdateIsAC.patchValue(isac.toString());
    this.getHallUpdateNumberOfChairs.patchValue(halldata.numberOfChairs);
    this.getHallUpdateNumberOfDesks.patchValue(halldata.numberOfDesks);
    this.getHallUpdatehallName.patchValue(halldata.hallName)
    this.isHallUpdateFormVisible = true;

  }

  submitClick(){
    let hall : HallVM;

    hall = {
      capacity : this.getHallCreationCapacity.value,
      hallName : this.getHallCreationhallName.value,
      isAC : this.getHallCreationIsAc.value,
      numberOfChairs : this.getHallCreationNumberOfChairs.value,
      numberOfDesks : this.getHallCreationNumberOfDesks.value,
      isActive : true
    }

    this.subs.sink = this.hallService.createHall(hall).subscribe(data => {
      if(data){
        this.newHall = data.content;
        this.hallAllData.push(this.newHall);
        this.hallTableData = this.hallAllData;
        this.hallTableData.reverse();
      }
      this.closeHallCreationPopup();
    });
  }
}
