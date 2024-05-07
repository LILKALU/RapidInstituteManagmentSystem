import { BaseResponse } from "./baseResponse";
import { GradeVM } from "./gradeVM";


export interface gradeResponse extends BaseResponse{
    content : GradeVM;
}