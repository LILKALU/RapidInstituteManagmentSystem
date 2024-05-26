import { CourseVM } from "./coursesVM";
import { studentVM } from "./studentVM";

export interface studentWiseCoursesVM {
    student : studentVM;
    course : CourseVM;
}