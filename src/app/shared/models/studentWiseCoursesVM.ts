import { CourseVM } from "./coursesVM";
import { studentVM } from "./studentVM";

export interface studentWiseCoursessVM {
    student ?: studentVM;
    courses ?: CourseVM[];
}