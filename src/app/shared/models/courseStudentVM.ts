import { CourseVM } from "./coursesVM";
import { studentVM } from "./studentVM";

export interface CourseStudentVM{
    student ?: studentVM;
    course ?: CourseVM
}