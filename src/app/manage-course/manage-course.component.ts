import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-manage-course',
  templateUrl: './manage-course.component.html',
  styleUrls: ['./manage-course.component.css']
})
export class ManageCourseComponent implements OnInit {

  private subs = new SubSink();
  isLoading : boolean = false;
  selectAction !: FormGroup;
  searchForm !: FormGroup;
  action : number | undefined;
  isCreateCourseFormButtonVisible : boolean = false;
  isCourseFormVisible : boolean = false;

  // get action value
  get getAction(): AbstractControl { return this.selectAction.get('action') as AbstractControl; }
  
  // get search value
  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  constructor(
    private formBuilder: FormBuilder,
  ){}

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm(){
    this.selectAction = this.formBuilder.group({
      action : ['' , Validators.required]
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });
  }

  loadTheContent(){
    this.action = parseInt(this.getAction.value);
    if(this.action === 1){
      this.isCreateCourseFormButtonVisible = false;
    }
  }

  openCourseForm(hallFormVisibility : boolean){
    this.isCourseFormVisible = hallFormVisibility;
  }

  searchHall(){

  }
}
