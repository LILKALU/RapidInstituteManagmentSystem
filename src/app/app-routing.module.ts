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
import { AuthGuard } from './shared/guard/guards/auth.guard';
import { ManageSalaryPaymentsComponent } from './manage-salary-payments/manage-salary-payments.component';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';
import { ManageLeaveComponent } from './manage-leave/manage-leave.component';

const routes: Routes = [
  {path : "login", component: LoginPageComponent},
  {path : "Dashboard", component: DashboardComponent, canActivate : [AuthGuard]},
  {path : "Manage Student", component: ManageStudentComponent ,canActivate : [AuthGuard]},
  {path : "Manage Course", component: ManageCourseComponent ,canActivate : [AuthGuard]},
  {path : "Manage Hall", component: ManageHallComponent ,canActivate : [AuthGuard]},
  {path : "Manage Subjects", component: ManageSubjectComponent ,canActivate : [AuthGuard]},
  {path : "Manage Teachers", component: ManageTeachersComponent ,canActivate : [AuthGuard]},
  {path : "Manage Enrolment", component: ManageEnrolmentComponent ,canActivate : [AuthGuard]},
  {path : "Manage Grades", component: ManageGradeComponent ,canActivate : [AuthGuard]},
  {path : "Manage Class Fees", component: ManageClassFeeComponent ,canActivate : [AuthGuard]},
  {path : "Manage Student Attendance", component: ManageAttendanceComponent ,canActivate : [AuthGuard]},
  {path : "Manage User Roles", component: ManageRoleComponent ,canActivate : [AuthGuard]},
  {path : "Manage Other Employee", component: ManageOtherEmployeeComponent ,canActivate : [AuthGuard]},
  {path : "Manage App Icons", component: AppIconsComponent ,canActivate : [AuthGuard]},
  {path : "Manage Actions", component: ManageActionComponent ,canActivate : [AuthGuard]},
  {path : "Manage Privileges", component: ManagePrivilageComponent ,canActivate : [AuthGuard]},
  {path : "Manage Salary Payment", component: ManageSalaryPaymentsComponent ,canActivate : [AuthGuard]},
  {path : "Manage Notification", component: ManageNotificationComponent ,canActivate : [AuthGuard]},
  {path : "Manage Leave", component: ManageLeaveComponent ,canActivate : [AuthGuard]},
  {path: '', redirectTo: 'Dashboard', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
