import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RapidSystemComponent } from './rapid-system/rapid-system.component';
import { ManageStudentComponent } from './manage-student/manage-student.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StepsModule } from 'primeng/steps';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ManageCourseComponent } from './manage-course/manage-course.component';
import { ManageHallComponent } from './manage-hall/manage-hall.component';
import {InputNumberModule} from 'primeng/inputnumber';
import {ConfirmationService, MessageService} from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ManageSubjectComponent } from './manage-subject/manage-subject.component';
import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ManageEnrolmentComponent } from './manage-enrolment/manage-enrolment.component';
import { ManageGradeComponent } from './manage-grade/manage-grade.component';
import { ManageClassFeeComponent } from './manage-class-fee/manage-class-fee.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { ManageAttendanceComponent } from './manage-attendance/manage-attendance.component';
import { ToastModule } from 'primeng/toast';
import { ReciptTemplateComponent } from './recipt-template/recipt-template.component';
import { ManageRoleComponent } from './manage-role/manage-role.component';
import { CapitalizeEachWordDirective } from './directives/capitalize-each-word.directive';
import { AppIconsComponent } from './app-icons/app-icons.component';
import { ManageActionComponent } from './manage-action/manage-action.component';


@NgModule({
  declarations: [
    AppComponent,
    RapidSystemComponent,
    ManageStudentComponent,
    DashboardComponent,
    ManageCourseComponent,
    ManageHallComponent,
    ManageSubjectComponent,
    ManageTeachersComponent,
    ManageEnrolmentComponent,
    ManageGradeComponent,
    ManageClassFeeComponent,
    ManageAttendanceComponent,
    ReciptTemplateComponent,
    ManageRoleComponent,
    CapitalizeEachWordDirective,
    AppIconsComponent,
    ManageActionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    BrowserAnimationsModule,
    StepsModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    NgbModule,
    TableModule,
    ToastModule,
    HttpClientModule,
    CardModule,
    CheckboxModule,
    ConfirmDialogModule,
    InputNumberModule,
    OverlayPanelModule,
    MessagesModule,
    MultiSelectModule,
  ],
  providers: [ConfirmationService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
