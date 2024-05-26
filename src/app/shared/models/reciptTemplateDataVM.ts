import { courseWiseMonths } from "./courseWiseMonthsVM";
import { studentVM } from "./studentVM";

export interface reciptTemplateDataVM{
    student ?: studentVM;
    courseWiseMonths ?: courseWiseMonths[];
    subTotal ?: number;
    resiptNumber ?: string
}