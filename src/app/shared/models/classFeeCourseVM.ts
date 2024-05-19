import { ClassFeeVM } from "./classFeeVM";
import { CourseVM } from "./coursesVM";
import { MonthVM } from "./monthVM";

export interface ClassFeeCourseVM {
    id ?: number;
    course ?: CourseVM;
    classFee ?: ClassFeeVM;
    amount ?: number;
    isAddmision ?: number;
    month ?: MonthVM
}