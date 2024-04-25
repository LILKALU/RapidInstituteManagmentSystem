import { CourseVM } from "./coursesVM";
import { EnrolmentCourseVM } from "./enrolmentCourse";
import { studentVM } from "./studentVM";

export interface EnrolmentVM {
    id ?: number;
    student ?: studentVM;
    enrolmentCorseDTO ?: EnrolmentCourseVM[];
    date ?: string;
}