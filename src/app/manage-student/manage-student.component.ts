import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { CourseService } from '../shared/services/course.service';
import { CourseVM } from '../shared/models/coursesVM';
import { GradeVM } from '../shared/models/gradeVM';
import { SubjectVM } from '../shared/models/subjectVM';
import { teacherVM } from '../shared/models/teachersVM';
import { studentVM } from '../shared/models/studentVM';
import { parentVM } from '../shared/models/parentVM';
import { addressVM } from '../shared/models/addressVM';
import { StudentService } from '../shared/services/student.service';
import { EnrolmentService } from '../shared/services/enrolment.service';
import { EnrolmentsResponse } from '../shared/models/enrolmentsResponseVM';
import { EnrolmentVM } from '../shared/models/enrolmentVM';
import { EnrolmentCourseVM } from '../shared/models/enrolmentCourse';
import { ClassFeeVM } from '../shared/models/classFeeVM';
import { ClassFeeService } from '../shared/services/class-fee.service';
import { ClassFeeCourseVM } from '../shared/models/classFeeCourseVM';
import { ParentService } from '../shared/services/parent.service';
import { ADAccountVM } from '../shared/models/adAccountVM';
import { AdAccountServiceService } from '../shared/services/ad-account-service.service';


@Component({
  selector: 'app-manage-student',
  templateUrl: './manage-student.component.html',
  styleUrls: ['./manage-student.component.css']
})
export class ManageStudentComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  today = new Date();
  selectStudentStatus !: FormGroup;
  studentDetailForm !: FormGroup;
  studentUpdateForm !: FormGroup;
  searchForm !: FormGroup;
  classFeeForm !: FormGroup;
  parentDetailForm !: FormGroup;
  parentUpdateForm !: FormGroup;
  enrollmentForm !: FormGroup;
  studentStatus : number | undefined
  isStudentFormVisible : boolean = false;
  isAditionalInfo : boolean = false;
  isUpdateFormRedy : boolean = false;
  addmisionFee : number = 1300;
  activeStepIndex : number = 0;
  updateActiveStepIndex : number = 0;
  courses : CourseVM[] = [];
  student : studentVM | undefined;
  updatedStudent : studentVM | undefined;
  adAccountDetails : ADAccountVM = {};
  enrolledCourses : CourseVM[] = [];
  grades : GradeVM[]= [];
  subjects : SubjectVM[] = [];
  isSearching : boolean = false;
  isASearchedParent : boolean = false;
  courseDates : string[] = [];
  studentTableData : studentVM[] = [];
  studentAllData : studentVM[] = [];
  searchedParent : parentVM | undefined;
  additionalInfoPopUpData : studentVM | undefined;
  courseTimes : string[] = [];
  enrollments : EnrolmentVM = {};
  isSearchParent : boolean = false;
  parentSearchForm !:FormGroup;
  isUpdating : boolean = false;
  isDeleting : boolean = false;
  relationships : any[] = [{name:'Mother'},{name:'Father'},{name:'Sister'},{name:'Brother'},{name:'Grand Mother'},{name:'Grand Father'},{name:'Aunty'},{name:'Uncle'},{name:'Gardian'}]; 
  dates : any[] = [{date:"Monday"},{date:"Tuesday"},{date:"Wednesday"},{date:"Thursday"},{date:"Friday"},{date:"Saturday"},{date:"Sunday"}]

  
  isloaded : boolean =false;
  instructors : teacherVM[]=[]

  steps = [
    { label: 'Student Form' },
    { label: 'Parant Form'},
    { label: 'Student Enrolment'},
    { label: 'Student Payment'},
    { label: 'Login Details'}
  ];

  updatesteps = [
    { label: 'Student Form' },
    { label: 'Parant Form'}
  ]
  
   
  get getStudentStatus(): AbstractControl { return this.selectStudentStatus.get('studentStatus') as AbstractControl; }

  //form controllers for the student detail form
  get getStudentFullName(): AbstractControl { return this.studentDetailForm.get('fullName') as AbstractControl; }
  get getStudentContactNumber(): AbstractControl { return this.studentDetailForm.get('contactNumber') as AbstractControl; }
  get getStudentBirthday(): AbstractControl { return this.studentDetailForm.get('birthday') as AbstractControl; }
  get getStudentGender(): AbstractControl { return this.studentDetailForm.get('gender') as AbstractControl; }
  get getStudenthouseNo(): AbstractControl { return this.studentDetailForm.get('houseNo') as AbstractControl; }
  get getStudentDistrict(): AbstractControl { return this.studentDetailForm.get('district') as AbstractControl; }
  get getStudentLane(): AbstractControl { return this.studentDetailForm.get('lane') as AbstractControl; }
  get getStudentCity(): AbstractControl { return this.studentDetailForm.get('city') as AbstractControl; }
  get getStudentCallingName(): AbstractControl { return this.studentDetailForm.get('callingName') as AbstractControl; }
  get getStudentSchool(): AbstractControl { return this.studentDetailForm.get('school') as AbstractControl; }

  //form controllers for the student detail update form 
  get getUpdateStudentFullName(): AbstractControl { return this.studentUpdateForm.get('fullName') as AbstractControl; }
  get getUpdateStudentContactNumber(): AbstractControl { return this.studentUpdateForm.get('contactNumber') as AbstractControl; }
  get getUpdateStudentBirthday(): AbstractControl { return this.studentUpdateForm.get('birthday') as AbstractControl; }
  get getUpdateStudentGender(): AbstractControl { return this.studentUpdateForm.get('gender') as AbstractControl; }
  get getUpdateStudenthouseNo(): AbstractControl { return this.studentUpdateForm.get('houseNo') as AbstractControl; }
  get getUpdateStudentDistrict(): AbstractControl { return this.studentUpdateForm.get('district') as AbstractControl; }
  get getUpdateStudentLane(): AbstractControl { return this.studentUpdateForm.get('lane') as AbstractControl; }
  get getUpdateStudentCity(): AbstractControl { return this.studentUpdateForm.get('city') as AbstractControl; }
  get getUpdateStudentCallingName(): AbstractControl { return this.studentUpdateForm.get('callingName') as AbstractControl; }
  get getUpdateStudentSchool(): AbstractControl { return this.studentUpdateForm.get('school') as AbstractControl; }

  //form controllers for the parent detail form
  get getParentFullName(): AbstractControl { return this.parentDetailForm.get('fullName') as AbstractControl; }
  get getParentTitle(): AbstractControl { return this.parentDetailForm.get('title') as AbstractControl; }
  get getParentNIC(): AbstractControl { return this.parentDetailForm.get('NIC') as AbstractControl; }
  get getParentBirthaday(): AbstractControl { return this.parentDetailForm.get('birthday') as AbstractControl; }
  get getParentRelationship(): AbstractControl { return this.parentDetailForm.get('relationship') as AbstractControl; }
  get getParentOccupation(): AbstractControl { return this.parentDetailForm.get('occupation') as AbstractControl; }
  get getParentContactNumber(): AbstractControl { return this.parentDetailForm.get('contactNumber') as AbstractControl; }

  //form controllers for the parent detail form
  get getUpdateParentFullName(): AbstractControl { return this.parentUpdateForm.get('fullName') as AbstractControl; }
  get getUpdateParentTitle(): AbstractControl { return this.parentUpdateForm.get('title') as AbstractControl; }
  get getUpdateParentNIC(): AbstractControl { return this.parentUpdateForm.get('NIC') as AbstractControl; }
  get getUpdateParentBirthaday(): AbstractControl { return this.parentUpdateForm.get('birthday') as AbstractControl; }
  get getUpdateParentRelationship(): AbstractControl { return this.parentUpdateForm.get('relationship') as AbstractControl; }
  get getUpdateParentOccupation(): AbstractControl { return this.parentUpdateForm.get('occupation') as AbstractControl; }
  get getUpdateParentContactNumber(): AbstractControl { return this.parentUpdateForm.get('contactNumber') as AbstractControl; }

  //form controllers for the parent search form
  get getNicNo(): AbstractControl { return this.parentSearchForm.get('nicNo') as AbstractControl; }

  //form controllers for the enrolments
  get getTheGrade(): AbstractControl { return this.enrollmentForm.get('grade') as AbstractControl; }
  get getTheSubject(): AbstractControl { return this.enrollmentForm.get('subject') as AbstractControl; }
  get getTheInstructor(): AbstractControl { return this.enrollmentForm.get('instructor') as AbstractControl; }
  get getTheTime(): AbstractControl { return this.enrollmentForm.get('time') as AbstractControl; }
  get getTheDate(): AbstractControl { return this.enrollmentForm.get('date') as AbstractControl; }


  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  get getHasPaymentDone(): AbstractControl { return this.classFeeForm.get('hasPaymentDone') as AbstractControl; }

  constructor(
    private courseServices : CourseService,
    private studentServices : StudentService,
    private formBuilder: FormBuilder,
    private enrolmentService : EnrolmentService,
    private classFeeService : ClassFeeService,
    private parentService : ParentService,
    private adAccountServiceService : AdAccountServiceService
  ) {
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.buildForm();
    this.subscriptions();
  }

  buildForm(){
    this.selectStudentStatus = this.formBuilder.group({
      studentStatus: ['', Validators.required],
    });

    this.searchForm = this.formBuilder.group({
      searchValue : ['',Validators.required]
    });

    this.studentDetailForm = this.formBuilder.group({
      fullName : ['', Validators.required],
      contactNumber : ['' , [Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      birthday : ['' , Validators.required],
      gender : ['', Validators.required],
      houseNo:['', Validators.required],
      lane:[''],
      city:['',Validators.required],
      district : ['',Validators.required],
      callingName:['',Validators.required],
      school:['',Validators.required]
    });

    this.studentUpdateForm = this.formBuilder.group({
      fullName : ['', Validators.required],
      contactNumber : ['' , [Validators.required, Validators.pattern(/^([0][7][01245678][0-9]{7})|([\\+][9][4][7][01245678][0-9]{7})|([0][1-9][1-9][0-9]{7})$/)]],
      birthday : ['' , Validators.required],
      gender : ['', Validators.required],
      houseNo:['', Validators.required],
      lane:[''],
      city:['',Validators.required],
      district : ['',Validators.required],
      callingName:['',Validators.required],
      school:['',Validators.required]
    });

    this.parentDetailForm = this.formBuilder.group({
      fullName:['',Validators.required],
      title:['',Validators.required],
      NIC:[{value : '',disabled:true},[Validators.required, Validators.pattern(/^([1][9][0-9]{10})|([2][0][0-9]{10})|([0-9]{9}[V])$/)]],
      birthday:['',Validators.required],
      relationship:['',Validators.required],
      occupation: ['',Validators.required],
      contactNumber : ['',Validators.required]
    })

    this.parentUpdateForm = this.formBuilder.group({
      fullName:['',Validators.required],
      title:['',Validators.required],
      NIC:['',[Validators.required, Validators.pattern(/^([1][9][0-9]{10})|([2][0][0-9]{10})|([0-9]{9}[V])$/)]],
      birthday:['',Validators.required],
      relationship:['',Validators.required],
      occupation: ['',Validators.required],
      contactNumber : ['',Validators.required]
    })

    this.enrollmentForm = this.formBuilder.group({
      grade:['',Validators.required],
      subject:[{value: '', disabled: true},Validators.required],
      instructor:[{value: '', disabled: true},Validators.required],
      time:[{value: '', disabled: true},Validators.required],
      date:[{value: '', disabled: true},Validators.required]

    })

    this.parentSearchForm = this.formBuilder.group({
      nicNo : ['',[Validators.required, Validators.pattern(/^([1][9][0-9]{10})|([2][0][0-9]{10})|([0-9]{9}[V])$/)]]
    })

    this.classFeeForm = this.formBuilder.group({
      hasPaymentDone:['',Validators.required]
    })
  }

  loadTheContent(){
    this.studentStatus = parseInt(this.getStudentStatus.value);
    if(this.studentStatus === 1){
      this.isStudentFormVisible = false;
    }
  }

  subscriptions(){
    this.isloaded = false;
    this.subs.sink = this.courseServices.getCourses().subscribe(data =>{
      if(data){
        this.isloaded = true;
        this.courses = data.content;
        console.log("courses" , this.courses);
        this.getGrade();
      }
    });

    // this.subs.sink = this.enrolmentService
    this.getAllStudent();
  }

  getAllStudent(){
    this.isloaded = false;
    this.subs.sink = this.studentServices.getStudent().subscribe(data =>{
      if(data){
        console.log("student data", data);
        this.isloaded = true;
        this.studentAllData = data.content;
        this.studentTableData = data.content;
        console.log("student table data", this.studentAllData);
        console.log("student all data", this.studentTableData);
        this.studentTableData.reverse();
      }
    });
  }

  getGrade(){
    this.courses.forEach(element => {
      this.grades.push(element.grade)
    });
    // this.getTheSubject?.disable();
    console.log("grade", this.grades);
    
  }

  getsubjects(){
    this.subjects = [];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id){
        this.subjects.push(element.subject);
      }
    });
    this.getTheSubject?.enable();
    console.log(this.getTheGrade.value.id);
  }

  getstudentcode(id : number) : string{
    let idInString : string = id.toString();
    let concatZeros : string = '';
    for (let index = idInString.length; index < 5; index++) {
      concatZeros = concatZeros + '0';
    }
    return 'S'+concatZeros + idInString;
  }

  getInstructors(){
    this.instructors = [];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id){
        this.instructors.push(element.teacher);
        
      }
    });
    this.getTheInstructor?.enable();
    console.log(this.instructors);
  }

  getDates(){
    this.courseDates = [];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id && element.teacher === this.getTheInstructor.value){
        this.courseDates.push(element.date);
      }
    });
    this.getTheDate?.enable();
    console.log(this.courses);
    
    console.log(this.courseDates);
    
  }

  getTimes(){
    this.courseTimes = [];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id && element.teacher === this.getTheInstructor.value && element.date === this.getTheDate.value){
        this.courseTimes.push(element.startTime);
      }
    });
    this.getTheTime?.enable();
  }

  openStudentForm(StudentFormVisibility : boolean){
    this.isStudentFormVisible = StudentFormVisibility;
  }

  nextClick(){
    console.log(this.getUpdateStudentDistrict.value);
    
    this.activeStepIndex = this.activeStepIndex + 1;
  }

  removeStudent(){
    this.isDeleting = true;
    let student : studentVM;
    let delStudent : studentVM
    student = this.additionalInfoPopUpData ? this.additionalInfoPopUpData : {};
    
    console.log(student);
    
    delStudent = {
      ...student,
      isActive : false
    }

    console.log(delStudent);

    this.subs.sink = this.studentServices.removeStudent(delStudent).subscribe(data =>{
      if(data){
        this.isDeleting = false;
        this.isAditionalInfo = false
        this.studentAllData.forEach((element , index) => {
          if(element.id == student.id){
            this.studentAllData.splice(index,1);
            this.studentTableData = this.studentAllData;
          }
        });
      }
    })
    
    
  }

  updateNextClick(){
    this.updateActiveStepIndex = this.updateActiveStepIndex + 1;
  }

  searchStudent(){
    this.studentTableData = this.studentAllData.filter(el => el.scode == this.getSearchValue.value)
    if(this.studentTableData.length === 0){
      this.studentTableData = this.studentAllData
      alert("No Matching Results")
    }
  }

  reset(){
    this.studentTableData = this.studentAllData;
    this.searchForm.reset();
  }

  removeCourse(course : any){
    console.log(course);
    this.enrolledCourses.forEach((element,index) => {
      if(element.id === course.id){
        this.enrolledCourses.splice(index,1);
      }
    });
  }

  generatePassword():string{
    let result = '';
    let length = 10;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|:;"\',.<>?1234567890';
    const charactersLength = characters.length; 
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  submitAndNextClick(){
    let id = 0;
    let parent : parentVM;
    if(this.isASearchedParent){
      parent = {
        id : this.searchedParent?.id,
        fullName : this.getParentFullName.value,
        title : this.getParentTitle.value,
        nic : this.getParentNIC.value,
        birthday : this.getParentBirthaday.value,
        relationship: this.getParentRelationship.value.name,
        occupation : this.getParentOccupation.value,
        contactNumber : this.getParentContactNumber.value,
        isActive : true,
      }
    }else{
      parent = {
        fullName : this.getParentFullName.value,
        title : this.getParentTitle.value,
        nic : this.getParentNIC.value,
        birthday : this.getParentBirthaday.value.toLocaleDateString(),
        relationship: this.getParentRelationship.value.name,
        occupation : this.getParentOccupation.value,
        contactNumber : this.getParentContactNumber.value,
        isActive : true,
      };
    }
    

    let address : addressVM = {
      houseNo : this.getStudenthouseNo.value,
      lane : this.getStudentLane.value,
      city : this.getStudentCity.value,
      district : this.getStudentCity.value
    }

    let student : studentVM = {
      fullName : this.getStudentFullName.value,
      callingName : this.getStudentCallingName.value,
      birthDay : this.getStudentBirthday.value.toLocaleDateString(),
      gender : this.getStudentGender.value,
      isActive : true,
      contactNumber : this.getStudentContactNumber.value,
      address : address,
      parent : parent,
      school : this.getStudentSchool.value,
      isAdmisionPaid : false
    }

    console.log(student);
    
    this.subs.sink = this.studentServices.createStudent(student).subscribe(data => {
      if(data && data.content && data.content.id && data.content.id > 0){
        this.student = data.content;
        console.log("all data before push", this.studentAllData);
        this.studentAllData.push(this.student);
        console.log("all data after push", this.studentAllData);
        console.log("table data befor equal", this.studentTableData);
        this.studentTableData = this.studentAllData;
        console.log("table data after equal", this.studentTableData);
        this.studentTableData.reverse();

        console.log("table data after reverse",  this.studentTableData);
        this.activeStepIndex = this.activeStepIndex + 1;
        
      }
    });
  }

  getIdFromScode(scode : string){

  }

  openAditionalInfo(studentdata : studentVM){
    this.isAditionalInfo = true;
    this.additionalInfoPopUpData = studentdata;
  }

  proceddPayment(){
    let classFee : ClassFeeVM;
    let classFeeCourses : ClassFeeCourseVM[]=[];
    let cf : ClassFeeCourseVM;
    let cfa : ClassFeeCourseVM;

    this.enrolledCourses.forEach(element => {
      cf = {
        course : element,
        amount : element.classFeeAmount,
        isAddmision : 0
      }
      classFeeCourses.push(cf);
    });

    cfa = {
      amount : this.addmisionFee,
      isAddmision : 1
    }
    classFeeCourses.push(cfa);

    classFee = {
      classFeeCourse : classFeeCourses,
      student : this.student
    }

    this.subs.sink = this.classFeeService.addStudentClassFees(classFee).subscribe(data =>{
      if(data){
        this.createStudentLoginDetails();
        this.activeStepIndex = this.activeStepIndex + 1;
      }
      
    })

  }

  createStudentLoginDetails(){
    let password : string = "student@1234"
    let usercode : string = this.student?.scode ? this.student?.scode : '';
    let userAccount : ADAccountVM;

    console.log("usercode" , usercode);
    console.log("password" , password);

    userAccount = {
      userCode : usercode,
      passWord : password
    }

    this.subs.sink = this.adAccountServiceService.createUserAccount(userAccount).subscribe(data =>{
      if(data){
        this.adAccountDetails = data.content ? data.content : {};
        console.log(this.adAccountDetails);
      }
    })
    
  }

  enrollCourses(){
    let enrolment : EnrolmentVM;
    let enrolmentCourse :EnrolmentCourseVM[] = [];
    let e : EnrolmentCourseVM;

    this.enrolledCourses.forEach(element => {
      e = {
        course : element
      }
      enrolmentCourse.push(e);
    });

    enrolment = {
      enrolmentCorseDTO : enrolmentCourse,
      student : this.student
    }

    console.log(enrolment);
    
    this.subs.sink = this.enrolmentService.addEnrolment(enrolment).subscribe(data => {
      if(data){
        this.enrollments = data.content;
        this.activeStepIndex = this.activeStepIndex +1;
      }
    });
  }

  classfeeWithAddmision() : number{
    let amount : number = 0;
    this.enrolledCourses.forEach(element => {
      amount = amount+element.classFeeAmount;
    });

    return amount+this.addmisionFee;
  }

  closeQuickStudentCreationPopup(){
   this.enrollmentForm.reset();
   this.parentDetailForm.reset();
   this.studentDetailForm.reset(); 
   this.isSearchParent = false;
   this.isStudentFormVisible = false;

   this.activeStepIndex = 0
  }

  addClass(){
      this.courses.forEach(element => {
        if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id && element.teacher === this.getTheInstructor.value && element.date === this.getTheDate.value && element.startTime === this.getTheTime.value){
          this.enrolledCourses.push(element);
        }
      });

      this.enrollmentForm.reset();
      console.log(this.enrolledCourses);
  }

  searchParent(){
    let searchedNIC = this.getNicNo.value;
    console.log(searchedNIC);
    this.isSearchParent = true;
    this.parentDetailForm.reset();

    this.subs.sink = this.parentService.getParentById(searchedNIC).subscribe(data => {
      if(data && data.content && data.code == "00"){
        this.searchedParent = data.content;
        this.getParentFullName.patchValue(data?.content?.fullName);
        this.getParentBirthaday.patchValue(data?.content?.birthday);
        this.getParentContactNumber.patchValue(data?.content?.contactNumber);
        this.getParentNIC.patchValue(data?.content?.nic);
        this.getParentOccupation.patchValue(data?.content?.occupation);
        this.getParentRelationship.patchValue(data?.content?.relationship);
        this.getParentTitle.patchValue(data?.content?.title);
        this.isASearchedParent = true;
      }else{
        this.isASearchedParent = false;
      }
    })
    console.log(searchedNIC);
    this.getParentNIC.patchValue(searchedNIC)
    console.log(this.getParentNIC.value);
    
  }

  previousClick(){
    this.activeStepIndex = this.activeStepIndex - 1;
  }

  updatePopupClose(){
    this.updateActiveStepIndex = 0;
    this.studentUpdateForm.reset();
    this.parentUpdateForm.reset()
  }

  updateStudent(){
    this.isUpdating = true;
    let parent : parentVM;
    parent = {
      id : this.additionalInfoPopUpData?.parent?.id,
      fullName : this.getUpdateParentFullName.value,
      title : this.getUpdateParentTitle.value,
      nic : this.getUpdateParentNIC.value,
      birthday : this.getUpdateParentBirthaday.value,
      relationship: this.getUpdateParentRelationship.value.name,
      occupation : this.getUpdateParentOccupation.value,
      contactNumber : this.getUpdateParentContactNumber.value,
      isActive : true,
    }
    

    let address : addressVM = {
      id : this.additionalInfoPopUpData?.address?.id,
      houseNo : this.getUpdateStudenthouseNo.value,
      lane : this.getUpdateStudentLane.value,
      city : this.getUpdateStudentCity.value,
      district : this.getUpdateStudentDistrict.value
    }

    let student : studentVM = {
      fullName : this.getUpdateStudentFullName.value,
      callingName : this.getUpdateStudentCallingName.value,
      birthDay : this.getUpdateStudentBirthday.value,
      gender : this.getUpdateStudentGender.value,
      isActive : true,
      contactNumber : this.getUpdateStudentContactNumber.value,
      address : address,
      parent : parent,
      school : this.getUpdateStudentSchool.value,
      isAdmisionPaid : false,
      id : this.additionalInfoPopUpData?.id,
      scode : this.additionalInfoPopUpData?.scode
    }

    console.log(student);
    
    this.subs.sink = this.studentServices.updateStudent(student).subscribe(data => {
      if(data && data.content && data.content.id && data.content.id > 0){
        console.log(data);
        
        this.updatedStudent = data.content
        this.studentAllData.forEach((element , index) => {
          if(element.id == this.updatedStudent?.id){
            this.studentAllData.splice(index,1,data.content);
            this.studentTableData = this.studentAllData;
            this.isUpdating = false;
            this.isUpdateFormRedy = false;
            this.isAditionalInfo = false;
          }
        });
      }
    });
  }

  goToUpdateForm(){
    console.log(this.additionalInfoPopUpData?.birthDay);
    
    this.getUpdateStudentBirthday.patchValue(this.additionalInfoPopUpData?.birthDay);
    this.getUpdateStudentCallingName.patchValue(this.additionalInfoPopUpData?.callingName);
    this.getUpdateStudentCity.patchValue(this.additionalInfoPopUpData?.address?.city);
    this.getUpdateStudentContactNumber.patchValue(this.additionalInfoPopUpData?.contactNumber);
    this.getUpdateStudentDistrict.patchValue(this.additionalInfoPopUpData?.address?.district);
    this.getUpdateStudentFullName.patchValue(this.additionalInfoPopUpData?.fullName);
    this.getUpdateStudentGender.patchValue(this.additionalInfoPopUpData?.gender);
    this.getUpdateStudentLane.patchValue(this.additionalInfoPopUpData?.address?.lane);
    this.getUpdateStudentSchool.patchValue(this.additionalInfoPopUpData?.school);
    this.getUpdateStudenthouseNo.patchValue(this.additionalInfoPopUpData?.address?.houseNo);

    this.getUpdateParentBirthaday.patchValue(this.additionalInfoPopUpData?.parent?.birthday);
    this.getUpdateParentContactNumber.patchValue(this.additionalInfoPopUpData?.parent?.contactNumber);
    this.getUpdateParentFullName.patchValue(this.additionalInfoPopUpData?.parent?.fullName);
    this.getUpdateParentNIC.patchValue(this.additionalInfoPopUpData?.parent?.nic);
    this.getUpdateParentOccupation.patchValue(this.additionalInfoPopUpData?.parent?.occupation);
    this.getUpdateParentRelationship.patchValue(this.additionalInfoPopUpData?.parent?.relationship);
    this.getUpdateParentTitle.patchValue(this.additionalInfoPopUpData?.parent?.title);

    console.log();
    
    
    this.isUpdateFormRedy = true;
  }

}
