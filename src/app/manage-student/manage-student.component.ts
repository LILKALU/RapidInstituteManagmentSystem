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
import { GradeService } from '../shared/services/grade.service';
import { MonthService } from '../shared/services/month.service';
import { MonthVM } from '../shared/models/monthVM';
import { ConfirmationService, MessageService } from 'primeng/api';
import { reciptTemplateDataVM } from '../shared/models/reciptTemplateDataVM';
import { courseWiseMonths } from '../shared/models/courseWiseMonthsVM';
import { EnrolmentCourseService } from '../shared/services/enrolment-course.service';
import { roleVM } from '../shared/models/roleVM';
import { RoleService } from '../shared/services/role.service';
import { loginDetailsVM } from '../shared/models/loginDetailsVM';
import { privilagesVM } from '../shared/models/privilagesVM';
import { LocalStorageService } from '../shared/services/local-storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manage-student',
  templateUrl: './manage-student.component.html',
  styleUrls: ['./manage-student.component.css']
})
export class ManageStudentComponent implements OnInit, OnDestroy {

  private subs = new SubSink();
  today = new Date();
  userCode : string = ''
  maxDate !: Date;
  appIconId : number = 2
  selectStudentStatus !: FormGroup;
  studentDetailForm !: FormGroup;
  studentUpdateForm !: FormGroup;
  searchForm !: FormGroup;
  classFeeForm !: FormGroup;
  payingMethodForm !: FormGroup
  cardDetailsForm !: FormGroup;
  parentDetailForm !: FormGroup;
  parentUpdateForm !: FormGroup;
  enrollmentForm !: FormGroup;
  studentStatus : number | undefined

  isStudentFormVisible : boolean = false;
  isAditionalInfo : boolean = false;
  isUpdateFormRedy : boolean = false;
  addmisionFee : number = 1300;
  total : number =0;
  activeStepIndex : number = 0;
  updateActiveStepIndex : number = 0;
  courses : CourseVM[] = [];
  student : studentVM | undefined;
  updatedStudent : studentVM | undefined;
  adAccountDetails : ADAccountVM = {};
  enrolledCourses : CourseVM[] = [];
  grades : GradeVM[]= [];
  subjects : SubjectVM[] = [];
  months : MonthVM[] = [];
  isSearching : boolean = false;
  isASearchedParent : boolean = false;
  courseDates : string[] = [];
  studentTableData : studentVM[] = [];
  studentAllData : studentVM[] = [];
  searchedParent : parentVM | undefined;
  additionalInfoPopUpData : studentVM | undefined;
  courseTimes : string[] = [];
  enrolments : EnrolmentVM | undefined;
  removeEnrolments : EnrolmentVM[]=[]; 
  enrollments : EnrolmentVM = {};
  isSearchParent : boolean = false;
  parentSearchForm !:FormGroup;
  isUpdating : boolean = false;
  isDeleting : boolean = false;
  role : roleVM|undefined
  allEnrolmentCourses : EnrolmentCourseVM[]=[];
  reciptTemplateData : reciptTemplateDataVM | undefined;
  proceedClassFeePayment : ClassFeeVM | undefined;
  logedDetails : loginDetailsVM | undefined;
  selectedStudent : studentVM | undefined;
  privilages : privilagesVM[] = [];
  relationships : any[] = [{name:'Mother'},{name:'Father'},{name:'Sister'},{name:'Brother'},{name:'Grand Mother'},{name:'Grand Father'},{name:'Aunty'},{name:'Uncle'},{name:'Gardian'}]; 
  dates : any[] = [{date:"Monday"},{date:"Tuesday"},{date:"Wednesday"},{date:"Thursday"},{date:"Friday"},{date:"Saturday"},{date:"Sunday"}]

  
  isloaded : boolean =false;
  instructors : teacherVM[]=[]

  steps = [
    { label: 'Student Form' },
    { label: 'Parant Form'},
    { label: 'Student Enrolment'},
    { label: 'Student Payment'},
    { label: 'Recipt'},
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
  get getStudentEmail(): AbstractControl { return this.studentDetailForm.get('email') as AbstractControl; }

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
  get getUpdateStudentEmail(): AbstractControl { return this.studentUpdateForm.get('email') as AbstractControl; }

  //form controllers for the parent detail form
  get getParentFullName(): AbstractControl { return this.parentDetailForm.get('fullName') as AbstractControl; }
  get getParentTitle(): AbstractControl { return this.parentDetailForm.get('title') as AbstractControl; }
  get getParentNIC(): AbstractControl { return this.parentDetailForm.get('NIC') as AbstractControl; }
  get getParentBirthaday(): AbstractControl { return this.parentDetailForm.get('birthday') as AbstractControl; }
  get getParentRelationship(): AbstractControl { return this.parentDetailForm.get('relationship') as AbstractControl; }
  get getParentOccupation(): AbstractControl { return this.parentDetailForm.get('occupation') as AbstractControl; }
  get getParentContactNumber(): AbstractControl { return this.parentDetailForm.get('contactNumber') as AbstractControl; }
  get getParentEmail(): AbstractControl { return this.parentDetailForm.get('email') as AbstractControl; }

  //form controllers for the parent detail form
  get getUpdateParentFullName(): AbstractControl { return this.parentUpdateForm.get('fullName') as AbstractControl; }
  get getUpdateParentTitle(): AbstractControl { return this.parentUpdateForm.get('title') as AbstractControl; }
  get getUpdateParentNIC(): AbstractControl { return this.parentUpdateForm.get('NIC') as AbstractControl; }
  get getUpdateParentBirthaday(): AbstractControl { return this.parentUpdateForm.get('birthday') as AbstractControl; }
  get getUpdateParentRelationship(): AbstractControl { return this.parentUpdateForm.get('relationship') as AbstractControl; }
  get getUpdateParentOccupation(): AbstractControl { return this.parentUpdateForm.get('occupation') as AbstractControl; }
  get getUpdateParentContactNumber(): AbstractControl { return this.parentUpdateForm.get('contactNumber') as AbstractControl; }
  get getUpdateParentEmail(): AbstractControl { return this.parentUpdateForm.get('email') as AbstractControl; }

  //form controllers for the parent search form
  get getNicNo(): AbstractControl { return this.parentSearchForm.get('nicNo') as AbstractControl; }

  //form controllers for the enrolments
  get getTheGrade(): AbstractControl { return this.enrollmentForm.get('grade') as AbstractControl; }
  get getTheSubject(): AbstractControl { return this.enrollmentForm.get('subject') as AbstractControl; }
  get getTheInstructor(): AbstractControl { return this.enrollmentForm.get('instructor') as AbstractControl; }
  get getTheTime(): AbstractControl { return this.enrollmentForm.get('time') as AbstractControl; }
  get getTheDate(): AbstractControl { return this.enrollmentForm.get('date') as AbstractControl; }

  get getPayingMethod(): AbstractControl { return this.payingMethodForm.get('method') as AbstractControl; }

  get getFirstFourDigit(): AbstractControl { return this.cardDetailsForm.get('firstFourDigit') as AbstractControl; }
  get getSecondFourDigit(): AbstractControl { return this.cardDetailsForm.get('secondFourDigit') as AbstractControl; }
  get getThirdFourDigit(): AbstractControl { return this.cardDetailsForm.get('thirdhFourDigit') as AbstractControl; }
  get getFourthFourDigit(): AbstractControl { return this.cardDetailsForm.get('fourthFourDigit') as AbstractControl; }
  get getExpirDate(): AbstractControl { return this.cardDetailsForm.get('expirDate') as AbstractControl; }
  get getCVC(): AbstractControl { return this.cardDetailsForm.get('CVC') as AbstractControl; }


  get getSearchValue(): AbstractControl { return this.searchForm.get('searchValue') as AbstractControl; }

  get getHasPaymentDone(): AbstractControl { return this.classFeeForm.get('hasPaymentDone') as AbstractControl; }

  constructor(
    private courseServices : CourseService,
    private studentServices : StudentService,
    private formBuilder: FormBuilder,
    private enrolmentService : EnrolmentService,
    private enrolmentCoursesService : EnrolmentCourseService,
    private classFeeService : ClassFeeService,
    private parentService : ParentService,
    private adAccountServiceService : AdAccountServiceService,
    private gradeServise : GradeService,
    private monthService : MonthService,
    private confirmationService: ConfirmationService,
    private roleService : RoleService,
    private localStorageService : LocalStorageService,
    private messageService: MessageService,
    private router : Router
  ) {

    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 5);
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    
  }

  ngOnInit(): void {
    this.getLoginData();
    this.buildForm();
    this.subscriptions();
  }

  getLoginData(){
    let loginData : any = this.localStorageService.getItem('login');
    this.logedDetails = JSON.parse(loginData)
    this.userCode = this.logedDetails?.usercode ? this.logedDetails?.usercode : ''
    this.privilages = this.logedDetails?.privilagesDTO ? this.logedDetails?.privilagesDTO : [];
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
      school:['',Validators.required],
      email : ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
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
      school:['',Validators.required],
      email : ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
    });

    this.parentDetailForm = this.formBuilder.group({
      fullName:['',Validators.required],
      title:['',Validators.required],
      NIC:[{value : '',disabled:true},[Validators.required, Validators.pattern(/^([1][9][0-9]{10})|([2][0][0-9]{10})|([0-9]{9}[V])$/)]],
      birthday:['',Validators.required],
      relationship:['',Validators.required],
      occupation: ['',Validators.required],
      contactNumber : ['',Validators.required],
      email : ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
    })

    this.parentUpdateForm = this.formBuilder.group({
      fullName:['',Validators.required],
      title:['',Validators.required],
      NIC:['',[Validators.required, Validators.pattern(/^([1][9][0-9]{10})|([2][0][0-9]{10})|([0-9]{9}[V])$/)]],
      birthday:['',Validators.required],
      relationship:['',Validators.required],
      occupation: ['',Validators.required],
      contactNumber : ['',Validators.required],
      email : ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]]
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

    this.payingMethodForm = this.formBuilder.group({
      method : ['' , Validators.required]
    });

    this.cardDetailsForm = this.formBuilder.group({
      firstFourDigit : [null,[Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      secondFourDigit : [null,[Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      thirdhFourDigit : [null,[Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      fourthFourDigit : [null,[Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      expirDate : [null, Validators.required],
      CVC : [null, [Validators.required, Validators.pattern(/^[0-9]{3}$/)]]
    })
  }

  loadTheContent(){
    this.studentStatus = parseInt(this.getStudentStatus.value);
    if(this.studentStatus === 1){
      this.isStudentFormVisible = false;
    }
  }


  isActionAllowed(action : number):boolean{
    if(this.privilages.filter(el => el.appIcon.id == this.appIconId && el.action.id == action).length > 0){
      return true;
    }else{
      return false;
    }
  }

  subscriptions(){
    let isprivilageHave : boolean;
    if(this.logedDetails){
      isprivilageHave = (this.logedDetails.privilagesDTO.filter(el => el.appIcon.id == this.appIconId).length > 0) ? true : false;
      if(isprivilageHave){
        this.isloaded = true;
        this.subs.sink = this.courseServices.getCourses().subscribe(data =>{
          if(data){
            this.isloaded = true;
            this.courses = data.content;
            this.getAllStudent();
          }
        });
      }else{
        alert('Not Allowed');
        this.router.navigate(['Dashboard']);
      }
    }else{
      alert('You are not logged in');
      this.router.navigate(['login']);
    }

    // this.subs.sink = this.enrolmentService
    
  }

  getAllStudent(){
    this.isloaded = false;
    if(this.logedDetails && this.logedDetails.usercode && this.logedDetails.id && this.logedDetails.usercode.charAt(0) == 'T'){
      this.subs.sink = this.studentServices.getStudentByTeacherId(this.logedDetails.id).subscribe(data =>{
        this.isloaded = false;
        this.studentAllData = data.content;
        this.studentAllData = this.studentAllData.filter(el => el.isActive == true)
        this.studentTableData = data.content;
        this.studentTableData.reverse();
        this.getGrade();
      })
    }else{
      this.subs.sink = this.studentServices.getStudent().subscribe(data =>{
        if(data){
          this.isloaded = true;
          this.studentAllData = data.content;
          this.studentTableData = data.content;
          this.studentTableData.reverse();
          this.getGrade();
        }
      });
    }
  }

  getGrade(){
    this.subs.sink = this.gradeServise.getGrades().subscribe(data => {
      if(data){
        this.grades = data.content
        this.getMonths();
      } 
    })
    
  }

  getMonths(){
    this.subs.sink = this.monthService.getMonths().subscribe(data =>{
      if(data){
        this.months = data.content;
        this.getEnrolmentCourses()
      }
    })
  }

  getEnrolmentCourses(){
    this.subs.sink = this.enrolmentCoursesService.getEnrolmentCourse().subscribe(data =>{
      if(data && data.content){
        this.allEnrolmentCourses = data.content;
        this.getRole();
      }
    })
  }

  getRole(){
    this.subs.sink = this.roleService.getRoles().subscribe(data =>{
      if(data && data.content){
        this.role = data.content.find(el => el.id && el.id == 1);
        this.isloaded = true;
      }
    })
  }

  getsubjects(){
    this.subjects = [];
    let uniqueSubjects : SubjectVM[];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && !this.subjects.includes(element.subject)){
        this.subjects.push(element.subject)
      }
    });

    uniqueSubjects = this.subjects.filter((subject, index, self) =>
      index === self.findIndex((s) => (
          s.id === subject.id
      ))
    );

    this.subjects = uniqueSubjects;
    this.getTheSubject?.enable();
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
    let uniqueInstructors : teacherVM[];
    this.instructors = [];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id){
        this.instructors.push(element.teacher);
      }
    });

    uniqueInstructors = this.instructors.filter((instructor, index, self) =>
      index === self.findIndex((i) => (
          i.id === instructor.id
      ))
    );

    this.instructors = uniqueInstructors;
    this.getTheInstructor?.enable();
  }

  getDates(){
    this.courseDates = [];
    this.courses.forEach(element => {
      if(element.grade.id === this.getTheGrade.value.id && element.subject.id === this.getTheSubject.value.id && element.teacher === this.getTheInstructor.value){
        this.courseDates.push(element.date);
      }
    });
    this.getTheDate?.enable();
    
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
    
    this.activeStepIndex = this.activeStepIndex + 1;
  }

  removeStudent(studentdata : studentVM){
    this.isDeleting = true;
    let student : studentVM;
    let delStudent : studentVM
    student = studentdata ? studentdata : {};
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete',
      accept: () => {
        delStudent = {
          ...student,
          isActive : false
        }
        this.getEnrolmentByStudent(studentdata);
    
        this.subs.sink = this.studentServices.removeStudent(delStudent).subscribe(data =>{
          if(data){
            this.isDeleting = false;
            this.isAditionalInfo = false
            this.studentAllData.forEach((element , index) => {
              if(element.id == student.id){
                this.studentAllData.splice(index,1);
                this.studentTableData = this.studentAllData;
                this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student Removed'});
              }
            });
            
          }
        })
        
      }
    })
    
    
  }

  getEnrolmentByStudent(studentdata : studentVM){
    let selectedEnrolment : EnrolmentCourseVM[]=[];
    let deletingEnrolment : EnrolmentCourseVM;
    let count : number = 0;

    selectedEnrolment = this.allEnrolmentCourses.filter(el => el && el.enrolment && el.enrolment.student && el.enrolment.student.id && studentdata && studentdata.id && studentdata.id == el.enrolment.student.id);

    selectedEnrolment.forEach((element,index) => {
      deletingEnrolment={
        ...element,
        isActive : false
      }

      selectedEnrolment.splice(index,1,deletingEnrolment);
    });

    this.subs.sink = this.enrolmentCoursesService.deleteCourses(selectedEnrolment).subscribe(data =>{
      if(data && data.content){
      }
    })
  }

  removeStudentEnrolments(){
    let removeEnrolments : EnrolmentVM[] = []
    let removeEnrolment : EnrolmentVM
    let removeEnrolmentCourse : EnrolmentCourseVM;
    let removeEnrolmentCourses : EnrolmentCourseVM[]=[];

    this.removeEnrolments.forEach((element,index) => {
      if(element.enrolmentCourses){
        removeEnrolmentCourses = element.enrolmentCourses
        removeEnrolmentCourses.forEach((ele,i) => {
          removeEnrolmentCourse = {
            ...ele,
            isActive : false
          }
          removeEnrolmentCourses.splice(i,1,removeEnrolmentCourse);
        });
      }
      removeEnrolment = {
        ...element,
        enrolmentCourses : removeEnrolmentCourses
      }
      this.removeEnrolments.splice(index,1,removeEnrolment);
    });

    this.subs.sink = this.enrolmentService.addEnrolments(this.removeEnrolments).subscribe(data =>{
      if(data){
        
      }
    })

  }

  updateNextClick(){
    this.updateActiveStepIndex = this.updateActiveStepIndex + 1;
  }

  searchStudent(){
    this.studentTableData = this.studentAllData.filter(el => el.scode == this.getSearchValue.value)
    if(!(this.studentTableData.length > 0)){
      this.studentTableData = this.studentAllData;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Student Code'});
    }
  }

  reset(){
    this.studentTableData = this.studentAllData;
    this.searchForm.reset();
  }

  removeCourse(course : any){
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
        email : this.getParentEmail.value
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
        email : this.getParentEmail.value
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
      isAdmisionPaid : false,
      email : this.getStudentEmail.value,
      role : this.role
    }
    
    this.subs.sink = this.studentServices.createStudent(student).subscribe(data => {
      if(data && data.content && data.content.id && data.content.id > 0){
        this.student = data.content;
        this.studentAllData.push(this.student);
        this.studentTableData = this.studentAllData;
        this.studentTableData.reverse();
        this.activeStepIndex = this.activeStepIndex + 1;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student Registered' });
        
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
    let todayMonth : number = this.today.getMonth() + 1;
    let classFee : ClassFeeVM;
    let classFeeCourses : ClassFeeCourseVM[]=[];
    let cf : ClassFeeCourseVM;
    let cfa : ClassFeeCourseVM;
    let month : MonthVM;
    month = this.months[-1];
    
    this.months.forEach(element => {
      if(element.id == todayMonth){
        month = element;
      }
    });

    this.enrolledCourses.forEach(element => {
      cf = {
        course : element,
        amount : element.classFeeAmount,
        isAddmision : 0,
        month : month
      }
      classFeeCourses.push(cf);
    });

    cfa = {
      amount : this.addmisionFee,
      isAddmision : 1,
      month : month
    }
    classFeeCourses.push(cfa);

    classFee = {
      classFeeCourse : classFeeCourses,
      student : this.student
    }

    this.subs.sink = this.classFeeService.addStudentClassFees(classFee).subscribe(data =>{
      if(data && data.content && data.content.classFeeCourse){
        this.proceedClassFeePayment = data.content;
        let classFeeCourses : ClassFeeCourseVM[]=[]; 
        let classFeeCourse : courseWiseMonths
        let payingCourseWiseMonths : courseWiseMonths[]=[];
        
        classFeeCourses = data.content.classFeeCourse;
        classFeeCourses.forEach(element => {
          if(element.course){
            let c = payingCourseWiseMonths.find(el => el.course && el.course.id && element && element.course && element.course.id && element.course.id == el.course.id);
            if(c){
              let index = payingCourseWiseMonths.indexOf(c);
              if(element.month){
                c.months?.push(element.month)
                payingCourseWiseMonths.splice(index,1,c);
              }
            }else{
              if(element.month){
                let m : MonthVM[] = [];
                m.push(element.month)
                let name : string;
                let ammount : number;
                name = '('+element.course.code+') - ' + element.course.teacher.fullName + '\'s ' + element.course.grade.name + ' ' + element.course.date + ' ' + element.course.subject.name + ' Class at ' + element.course.startTime;
                ammount = element.course.classFeeAmount;
                classFeeCourse = {
                  course : element.course,
                  months : m,
                  courseName:name,
                  courseAmount : ammount
                }
                payingCourseWiseMonths.push(classFeeCourse);
              }
            }
          }else{
            if(element.month){
              let m : MonthVM[] = [];
              m.push(element.month)
              let name : string = "Admision";
              let ammount : number = this.addmisionFee;
              classFeeCourse = {
                course : element.course,
                months : m,
                courseName:name,
                courseAmount : ammount
              }
              payingCourseWiseMonths.push(classFeeCourse);
            }
          }
        });

        this.reciptTemplateData = {
          courseWiseMonths : payingCourseWiseMonths,
          resiptNumber : data.content.reciptNumber,
          student : data.content.student,
          subTotal : this.total
        }

        this.createStudentLoginDetails();
        this.activeStepIndex = this.activeStepIndex + 1;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Payment Success' });
      }
      
    })

  }

  createStudentLoginDetails(){
    let password : string = "student@1234"
    let usercode : string = this.student?.scode ? this.student?.scode : '';
    let userAccount : ADAccountVM;

    userAccount = {
      userCode : usercode,
      passWord : password
    }

    this.subs.sink = this.adAccountServiceService.createUserAccount(userAccount).subscribe(data =>{
      if(data){
        this.adAccountDetails = data.content ? data.content : {};
      }
    })
    
  }

  enrollCourses(){
    let enrolment : EnrolmentVM;
    let enrolmentCourse :EnrolmentCourseVM[] = [];
    let e : EnrolmentCourseVM;

    this.enrolledCourses.forEach(element => {
      e = {
        course : element,
        isActive : true
      }
      enrolmentCourse.push(e);
    });

    enrolment = {
      enrolmentCourses : enrolmentCourse,
      student : this.student
    }
    
    this.subs.sink = this.enrolmentService.addEnrolment(enrolment).subscribe(data => {
      if(data && data.content){
        this.enrollments = data.content;
        this.activeStepIndex = this.activeStepIndex +1;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student Enrolled' });
      }
    });
  }

  classfeeWithAddmision() : number{
    let amount : number = 0;
    this.enrolledCourses.forEach(element => {
      amount = amount+element.classFeeAmount;
    });
    this.total = amount+this.addmisionFee;
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
  }

  searchParent(){
    let searchedNIC = this.getNicNo.value;
    this.isSearchParent = true;
    this.parentDetailForm.reset();
    let relationship : any

    this.subs.sink = this.parentService.getParentById(searchedNIC).subscribe(data => {
      if(data && data.content && data.code == "00"){
        this.searchedParent = data.content;
        this.getParentFullName.patchValue(data?.content?.fullName);
        this.getParentBirthaday.patchValue(data?.content?.birthday);
        this.getParentBirthaday.disable();
        this.getParentContactNumber.patchValue(data?.content?.contactNumber);
        this.getParentNIC.patchValue(data?.content?.nic);
        this.getParentOccupation.patchValue(data?.content?.occupation);

        relationship = this.relationships.find(el => el.name == data?.content?.relationship)
        this.getParentRelationship.patchValue(relationship);

        this.getParentTitle.patchValue(data?.content?.title);
        this.getParentEmail.patchValue(data.content.email)
        this.isASearchedParent = true;
      }else{
        let dobString : string
        dobString = this.getBirthdayByNic(searchedNIC);
        let dob = new Date(dobString)
        this.getParentBirthaday.patchValue(dob);
        this.getParentBirthaday.disable();
        this.isASearchedParent = false;
      }
    })
    this.getParentNIC.patchValue(searchedNIC)
    
  }

  getBirthdayByNic(nicNo : string) :string{
    let birthYear: any;
    let birthMonth: any;
    let birthDate: any;
    let dob : any
 
    if (nicNo.length === 10) {
      birthYear = nicNo.substring(0, 2);
      birthYear = '19' + birthYear;
      birthDate = nicNo.substring(2, 5);
      birthDate = parseInt(birthDate);

      if (birthDate > 500) {
        birthDate = birthDate - 500;
      }

        if (birthDate > 335) {
          birthDate = birthDate - 335;
          birthMonth = 12;
        } else if (birthDate > 305) {
          birthDate = birthDate - 305;
          birthMonth = 11;
        } else if (birthDate > 274) {
          birthDate = birthDate - 274;
          birthMonth = 10;
        } else if (birthDate > 244) {
          birthDate = birthDate - 244;
          birthMonth = 9;
        } else if (birthDate > 213) {
          birthDate = birthDate - 213;
          birthMonth = 8;
        } else if (birthDate > 182) {
          birthDate = birthDate - 182;
          birthMonth = 7;
        } else if (birthDate > 152) {
          birthDate = birthDate - 152;
          birthMonth = 6;
        } else if (birthDate > 121) {
          birthDate = birthDate - 121;
          birthMonth = 5;
        } else if (birthDate > 91) {
          birthDate = birthDate - 91;
          birthMonth = 4;
        } else if (birthDate > 60) {
          birthDate = birthDate - 60;
          birthMonth = 3;
        } else if (birthDate < 32) {
          birthMonth = 1;
        } else if (birthDate > 31) {
          birthDate = birthDate - 31;
          birthMonth = 2;
        }

    } else {
      birthYear = nicNo.substring(0, 4);
      birthDate = nicNo.substring(4, 7);
      birthDate = parseInt(birthDate);
      if (birthDate > 500) {
        birthDate = birthDate - 500;
      }

        if (birthDate > 335) {
          birthDate = birthDate - 335;
          birthMonth = 12;
        } else if (birthDate > 305) {
          birthDate = birthDate - 305;
          birthMonth = 11;
        } else if (birthDate > 274) {
          birthDate = birthDate - 274;
          birthMonth = 10;
        } else if (birthDate > 244) {
          birthDate = birthDate - 244;
          birthMonth = 9;
        } else if (birthDate > 213) {
          birthDate = birthDate - 213;
          birthMonth = 8;
        } else if (birthDate > 182) {
          birthDate = birthDate - 182;
          birthMonth = 7;
        } else if (birthDate > 152) {
          birthDate = birthDate - 152;
          birthMonth = 6;
        } else if (birthDate > 121) {
          birthDate = birthDate - 121;
          birthMonth = 5;
        } else if (birthDate > 91) {
          birthDate = birthDate - 91;
          birthMonth = 4;
        } else if (birthDate > 60) {
          birthDate = birthDate - 60;
          birthMonth = 3;
        } else if (birthDate < 32) {
          birthMonth = 1;
        } else if (birthDate > 31) {
          birthDate = birthDate - 31;
          birthMonth = 2;
        }
    }
    // let timeDiff = Math.abs(Date.now() - new Date(birthYear).getTime());
    // let fullbirthYear = new Date(birthYear).getFullYear();
    dob = `${birthYear}-${birthMonth}-${birthDate}`

    return dob
    
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
    let studentId : number = this.selectedStudent?.id ? this.selectedStudent.id : 0;
    let studentCode : string = this.selectedStudent?.scode ? this.selectedStudent.scode : '';
    let parent : parentVM;
    parent = {
      ...this.selectedStudent?.parent,
      fullName : this.getUpdateParentFullName.value,
      title : this.getUpdateParentTitle.value,
      nic : this.getUpdateParentNIC.value,
      birthday : this.getUpdateParentBirthaday.value,
      relationship: this.getUpdateParentRelationship.value.name,
      occupation : this.getUpdateParentOccupation.value,
      contactNumber : this.getUpdateParentContactNumber.value,
      isActive : true,
      email : this.getUpdateParentEmail.value
    }
    

    let address : addressVM = {
      ...this.selectedStudent?.address,
      houseNo : this.getUpdateStudenthouseNo.value,
      lane : this.getUpdateStudentLane.value,
      city : this.getUpdateStudentCity.value,
      district : this.getUpdateStudentDistrict.value
    }

    let student : studentVM = {
      id : studentId,
      scode : studentCode,
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
      email : this.getUpdateStudentEmail.value,
      role : this.role
    }
    
    this.subs.sink = this.studentServices.updateStudent(student).subscribe(data => {
      if(data && data.content && data.content.id && data.content.id > 0){
        
        this.updatedStudent = data.content
        this.studentAllData.forEach((element , index) => {
          if(element.id == this.updatedStudent?.id){
            this.studentAllData.splice(index,1,data.content);
            this.studentTableData = this.studentAllData;
            this.isUpdating = false;
            this.isUpdateFormRedy = false;
            this.isAditionalInfo = false;
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Student Updated' });
          }
        });
      }
    });
  }

  goToUpdateForm(studentdata : studentVM){
    let relationship : any
    this.selectedStudent = studentdata;
    this.getUpdateStudentBirthday.patchValue(studentdata?.birthDay);
    this.getUpdateStudentCallingName.patchValue(studentdata?.callingName);
    this.getUpdateStudentCity.patchValue(studentdata?.address?.city);
    this.getUpdateStudentContactNumber.patchValue(studentdata?.contactNumber);
    this.getUpdateStudentDistrict.patchValue(studentdata?.address?.district);
    this.getUpdateStudentFullName.patchValue(studentdata?.fullName);
    this.getUpdateStudentGender.patchValue(studentdata?.gender);
    this.getUpdateStudentLane.patchValue(studentdata?.address?.lane);
    this.getUpdateStudentSchool.patchValue(studentdata?.school);
    this.getUpdateStudenthouseNo.patchValue(studentdata?.address?.houseNo);
    this.getUpdateStudentEmail.patchValue(studentdata.email)

    this.getUpdateParentBirthaday.patchValue(studentdata?.parent?.birthday);
    this.getUpdateParentContactNumber.patchValue(studentdata?.parent?.contactNumber);
    this.getUpdateParentFullName.patchValue(studentdata?.parent?.fullName);
    this.getUpdateParentNIC.patchValue(studentdata?.parent?.nic);
    this.getUpdateParentOccupation.patchValue(studentdata?.parent?.occupation);

    relationship = this.relationships.find(el => el.name == studentdata?.parent?.relationship)
    this.getUpdateParentRelationship.patchValue(relationship);
    this.getUpdateParentTitle.patchValue(studentdata?.parent?.title);
    this.getUpdateParentEmail.patchValue(studentdata.parent?.email)
    
    
    this.isUpdateFormRedy = true;
  }

}
