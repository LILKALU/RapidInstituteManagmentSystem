import { BaseResponse } from "./baseResponse";
import { EnrolmentVM } from "./enrolmentVM";
import { GradeVM } from "./gradeVM";


export interface gradesResponse extends BaseResponse{
    content : GradeVM[];
}