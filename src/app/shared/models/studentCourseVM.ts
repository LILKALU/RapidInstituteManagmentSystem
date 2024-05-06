import { CourseVM } from "./coursesVM";
import { studentVM } from "./studentVM";

export interface StudentCourseVM{
    course ?: CourseVM;
    student ?: studentVM;
    enrolledDate ?: string;
}