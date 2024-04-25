import { CourseVM } from "./coursesVM";
import { EnrolmentVM } from "./enrolmentVM";

export interface EnrolmentCourseVM{

    id ?: number;
    code ?: string;
    enrolment ?: EnrolmentVM;
    course ?: CourseVM;

}