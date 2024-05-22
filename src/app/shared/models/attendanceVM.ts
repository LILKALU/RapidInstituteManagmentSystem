import { studentVM } from "./studentVM";
import { CourseVM } from "./coursesVM";
import { MonthVM } from "./monthVM";

export interface attendanceVM{
    id ?: number;
    year : number;
    date : number;
    month : MonthVM;
    isAttend : boolean;
    student : studentVM;
    course : CourseVM;
}