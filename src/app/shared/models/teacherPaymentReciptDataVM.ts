import { courseWiseMonths } from "./courseWiseMonthsVM";
import { courseWisePaymentVM } from "./courseWisePaymentVM";
import { MonthVM } from "./monthVM";
import { teacherVM } from "./teachersVM";

export interface teacherPaymentReciptDataVM{
    teacher ?: teacherVM;
    courseWisePayment ?: courseWisePaymentVM[];
    netPayment ?: number;
    total ?: number;
    resiptNumber ?: string
    month : MonthVM
}