import { ClassFeeVM } from "./classFeeVM";
import { CourseVM } from "./coursesVM";

export interface ClassFeeCourseVM {
    id ?: number;
    course ?: CourseVM;
    classFee ?: ClassFeeVM;
    amount ?: number;
    isAddmision ?: number;
}