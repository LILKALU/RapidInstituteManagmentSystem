import { BaseResponse } from "./baseResponse";
import { courseWiseMonthsWithStudentVM } from "./courseWiseMonthsWithStudentVM";

export interface courseWiseMonthsWithStudentResponseVM extends BaseResponse{
    content : courseWiseMonthsWithStudentVM
}