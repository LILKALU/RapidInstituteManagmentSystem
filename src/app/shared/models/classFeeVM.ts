import { ClassFeeCourseVM } from "./classFeeCourseVM";
import { CourseVM } from "./coursesVM";
import { studentVM } from "./studentVM";

export interface ClassFeeVM{
    id ?: number;
    student ?: studentVM;
    date ?: string;
    classFeeCourse ?: ClassFeeCourseVM[];
}