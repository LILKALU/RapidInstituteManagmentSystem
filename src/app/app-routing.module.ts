import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageStudentComponent } from './manage-student/manage-student.component';
import { ManageCourseComponent } from './manage-course/manage-course.component';
import { ManageHallComponent } from './manage-hall/manage-hall.component';
import { ManageSubjectComponent } from './manage-subject/manage-subject.component';
import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { ManageEnrolmentComponent } from './manage-enrolment/manage-enrolment.component';
import { ManageGradeComponent } from './manage-grade/manage-grade.component';
import { ManageClassFeeComponent } from './manage-class-fee/manage-class-fee.component';
import { ManageAttendanceComponent } from './manage-attendance/manage-attendance.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { ManageOtherEmployeeComponent } from './manage-other-employee/manage-other-employee.component';
import { AppIconsComponent } from './app-icons/app-icons.component';
import { ManageActionComponent } from './manage-action/manage-action.component';
import { ManagePrivilageComponent } from './manage-privilage/manage-privilage.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  {path : "login", component: LoginPageComponent},
  {path : "Dashboard", component: DashboardComponent},
  {path : "Manage Student", component: ManageStudentComponent},
  {path : "Manage Course", component: ManageCourseComponent},
  {path : "Manage Hall", component: ManageHallComponent},
  {path : "Manage Subjects", component: ManageSubjectComponent},
  {path : "Manage Teachers", component: ManageTeachersComponent},
  {path : "Manage Enrolment", component: ManageEnrolmentComponent},
  {path : "Manage Grades", component: ManageGradeComponent},
  {path : "Manage Class Fees", component: ManageClassFeeComponent},
  {path : "Manage Student Attendance", component: ManageAttendanceComponent},
  {path : "Manage User Roles", component: ManageRoleComponent},
  {path : "Manage Other Employee", component: ManageOtherEmployeeComponent},
  {path : "Manage App Icons", component: AppIconsComponent},
  {path : "Manage Actions", component: ManageActionComponent},
  {path : "Manage Privileges", component: ManagePrivilageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
